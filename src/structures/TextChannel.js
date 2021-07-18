const { TextChannel } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector')
const GPayload = require('./GPayload');
const ifDjsV13 = (require('../util/updater')).checkDjsVersion('13');

module.exports = Object.defineProperties(TextChannel.prototype, require("./TextChannelBase"));