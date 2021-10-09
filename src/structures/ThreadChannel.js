const { ThreadChannel } = require('discord.js');

module.exports = Object.defineProperties(ThreadChannel.prototype, require('./TextChannelBase'));
