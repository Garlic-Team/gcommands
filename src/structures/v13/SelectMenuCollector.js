const { Collector } = require('discord.js');
const Collection = require('discord.js').Collection;
const { Events } = require('discord.js').Constants;

class SelectMenuCollector extends Collector {
  constructor(message, filter, options = {}) {
    super(this.client, filter, options);

    /**
     * client
     * @type {Client}
     */
    this.client = message.client;
    
    this.message = message;

    this.users = new Collection();

    this.total = 0;

    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    this.client.incrementMaxListeners();
    this.client.on('selectMenu', this.handleCollect);
    this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
    this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);

    this.once('end', () => {
      this.client.removeListener('selectMenu', this.handleCollect);
      this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
      this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', (menu) => {
      this.total++;
      this.users.set(menu.clicker.user.id, menu.clicker.user);
    });
  }

  collect(menu) {
    if(this.message.unstable) return SelectMenuCollector.key(menu)
    if (menu.message.id !== this.message.id) return null;
    return SelectMenuCollector.key(menu);
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

  static key(menu) {
    return menu.id;
  }
}

module.exports = SelectMenuCollector;