const { Collector } = require('discord.js');
const Collection = require('discord.js').Collection;
const { Events } = require('discord.js').Constants;
const { MessageComponentTypes, InteractionTypes } = require('../../util/Constants');

/**
 * Collects buttons on a message.
 * Will automatically stop if the channel (`'channelDelete'`), guild (`'guildDelete'`) or message (`'messageDelete'`) are deleted.
 * @extends {Collector}
 */
class InteractionCollector extends Collector {
  /**
   * @param {Client} client
   * @param {CollectorOptions} options The options to be applied to this collector
   * @emits InteractionCollector#GInteraction
   */
  constructor(client, filter, options = {}) {
    super(client, filter, options);

    /**
     * The message from which to collect interactions, if provided
     * @type {?Snowflake}
     */
    this.messageId = options.messageId || null;

    /**
      * The channel from which to collect interactions, if provided
      * @type {?Snowflake}
      */
    this.channelId = options.channelId;

    /**
      * The guild from which to collect interactions, if provided
      * @type {?Snowflake}
      */
    this.guildId = options.guildId;

    /**
      * The the type of interaction to collect
      * @type {?InteractionType}
      */
    this.interactionType =
      typeof options.interactionType === 'number'
        ? InteractionTypes[options.interactionType]
        : options.interactionType || null;

    /**
      * The the type of component to collect
      * @type {?MessageComponentType}
      */
    this.componentType =
      typeof options.componentType === 'number'
        ? MessageComponentTypes[options.componentType]
        : options.componentType || null;

    /**
     * Users
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * Total
     * @type {Number}
     */
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
      this.users.set(interaction.author.id, interaction.author);
    });
  }

  /**
   * Handles a button for possible collection.
   * @param {GInteraction} button
   * @returns {GInteraction}
   * @private
   */
  collect(interaction) {
    /**
     * Emitted whenever an interaction is collected.
     * @event InteractionCollector#collect
     * @param {Interaction} interaction The interaction that was collected
     */

    if (this.interactionType && interaction.type !== this.interactionType) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message.id !== this.messageId) return null;
    if (this.channelId && interaction.channel.id !== this.channelId) return null;
    if (this.guildId && interaction.guild.id !== this.guildId) return null;

    return interaction.id;
  }

  /**
   * Handles an interaction for possible disposal.
   * @param {Interaction} interaction The interaction that could be disposed of
   * @returns {?Snowflake}
   */
  dispose(interaction) {
    /**
     * Emitted whenever an interaction is disposed of.
     * @event InteractionCollector#dispose
     * @param {Interaction} interaction The interaction that was disposed of
     */
    if (this.type && interaction.type !== this.type) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message.id !== this.messageId) return null;
    if (this.channelId && interaction.channel.id !== this.channelId) return null;
    if (this.guildId && interaction.guild.id !== this.guildId) return null;

    return interaction.id;
  }

  /**
   * Empties this button collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  /**
   * The reason this collector has ended with, or null if it hasn't ended yet
   * @type {?string}
   * @readonly
   */
  endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Handles checking if the message has been deleted, and if so, stops the collector with the reason 'messageDelete'.
   * @private
   * @param {Guild} message The message that was deleted
   * @returns {void}
   */
  _handleMessageDeletion(message) {
    if (message.id === this.messageId) {
      this.stop('messageDelete');
    }
  }

  /**
   * Handles checking if the channel has been deleted, and if so, stops the collector with the reason 'channelDelete'.
   * @private
   * @param {Guild} channel The channel that was deleted
   * @returns {void}
   */
  _handleChannelDeletion(channel) {
    if (channel.id === this.channelId) {
      this.stop('channelDelete');
    }
  }

  /**
   * Handles checking if the guild has been deleted, and if so, stops the collector with the reason 'guildDelete'.
   * @private
   * @param {Guild} guild The guild that was deleted
   * @returns {void}
   */
  _handleGuildDeletion(guild) {
    if (guild.id === this.guildId) {
      this.stop('guildDelete');
    }
  }
}

module.exports = InteractionCollector;
