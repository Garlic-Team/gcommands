const { Collector } = require('discord.js');
const Collection = require('discord.js').Collection;
const { Events } = require('discord.js').Constants;
const { MessageComponentTypes, InteractionTypes } = require('../../util/Constants');

class InteractionCollector extends Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);

    this.messageId = options.messageId || null;
    this.channelId = options.channelId || null;
    this.guildId = options.guildId;

    this.interactionType =
      typeof options.interactionType === 'number'
        ? InteractionTypes[options.interactionType]
        : options.interactionType || null;

    this.componentType =
      typeof options.componentType === 'number'
        ? MessageComponentTypes[options.componentType]
        : options.componentType || null;

    this.users = new Collection();

    this.total = 0;

    this.empty = this.empty.bind(this);
    this.client.incrementMaxListeners();

    if (this.messageId) {
      this._handleMessageDeletion = this._handleMessageDeletion.bind(this);
      this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
    }

    if (this.channelId) {
      this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
      this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    }

    if (this.guildId) {
      this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
      this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);
    }

    this.client.on('GInteraction', this.handleCollect);

    this.once('end', () => {
      this.client.removeListener('GInteraction', this.handleCollect);
      this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
      this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', interaction => {
      this.total++;
      this.users.set(interaction.user.id, interaction.user);
    });
  }

  collect(interaction) {
    if (this.interactionType && interaction.type !== this.interactionType) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message.id !== this.messageId) return null;
    if (this.channelId && interaction.channel.id !== this.channelId) return null;
    if (this.guildId && interaction.guild.id !== this.guildId) return null;

    return interaction.id;
  }

  dispose(interaction) {
    if (this.type && interaction.type !== this.type) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message.id !== this.messageId) return null;
    if (this.channelId && interaction.channel.id !== this.channelId) return null;
    if (this.guildId && interaction.guild.id !== this.guildId) return null;

    return interaction.id;
  }

  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  _handleMessageDeletion(message) {
    if (message.id === this.messageId) {
      this.stop('messageDelete');
    }
  }
  _handleChannelDeletion(channel) {
    if (channel.id === this.channelId) {
      this.stop('channelDelete');
    }
  }

  _handleGuildDeletion(guild) {
    if (guild.id === this.guildId) {
      this.stop('guildDelete');
    }
  }
}

module.exports = InteractionCollector;
