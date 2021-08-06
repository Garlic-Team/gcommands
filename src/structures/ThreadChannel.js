const ifDjsV13 = (require('../util/util')).checkDjsVersion('13');

module.exports = () => ifDjsV13 ? Object.defineProperties(require("discord.js").ThreadChannel.prototype, require("./TextChannelBase")) : null;
