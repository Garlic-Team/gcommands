const ifDjsV13 = (require('../util/updater')).checkDjsVersion('13');
const { ThreadChannel } = require('discord.js');

module.exports = ifDjsV13 ? Object.defineProperties(ThreadChannel.prototype, require("./TextChannelBase")) : null;
