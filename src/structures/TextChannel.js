const { TextChannel } = require('discord.js');

module.exports = Object.defineProperties(TextChannel.prototype, require('./TextChannelBase'));
