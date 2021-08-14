const { Collector } = require('discord.js');
const Collection = require('discord.js').Collection;
const { Events } = require('discord.js').Constants;

class ButtonCollector extends Collector {
  constructor(message, filter, options = {}) {
    super(message.client, filter, options);

    this.message = message;

    this.users = new Collection();

    this.total = 0;

    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    this.message.client.incrementMaxListeners();
    this.message.client.on('clickButton', this.handleCollect);
    this.message.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
    this.message.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    this.message.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);

    this.once('end', () => {
      this.message.client.removeListener('clickButton', this.handleCollect);
      this.message.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
      this.message.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.message.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.message.client.decrementMaxListeners();
    });

    this.on('collect', button => {
      this.total++;
      this.users.set(button.clicker.user.id, button.clicker.user);
    });
  }

  collect(button) {
    if (this.message.unstable) return ButtonCollector.key(button);
    if (button.message.id !== this.message.id) return null;
    return ButtonCollector.key(button);
  }

  dispose() {
    return null;
  }

  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  _handleMessageDeletion(message) {
    if (message.id === this.message.id) {
      this.stop('messageDelete');
    }
  }

  _handleChannelDeletion(channel) {
    if (channel.id === this.message.channel.id) {
      this.stop('channelDelete');
    }
  }

  _handleGuildDeletion(guild) {
    if (this.message.guild && guild.id === this.message.guild.id) {
      this.stop('guildDelete');
    }
  }

  static key(button) {
    return button.id;
  }
}

module.exports = ButtonCollector;
