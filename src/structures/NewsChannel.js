const { NewsChannel } = require('discord.js');

module.exports = Object.defineProperties(NewsChannel.prototype, require('./TextChannelBase'));
