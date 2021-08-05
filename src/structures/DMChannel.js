const { DMChannel } = require('discord.js');

module.exports = Object.defineProperties(DMChannel.prototype, require('./TextChannelBase'));
