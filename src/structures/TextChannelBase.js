const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const GPayload = require('./GPayload');
const InteractionCollectorV12 = require('./v12/InteractionCollector');
const InteractionCollectorV13 = require('./v13/InteractionCollector');
const ifDjsV13 = require('../util/util').checkDjsVersion('13');

/**
 * The TextChannelBase
 */
module.exports = {
    send: {

        /**
         * Send a message.
         * @param {string|GPayloadOptions} result
         * @returns {Message}
         */
        value: async function(result) {
            const GPayloadResult = await GPayload.create(this, result)
                .resolveData()
                .resolveFiles();

            const m = await this.client.api.channels[this.id].messages.post({
                data: GPayloadResult.data,
                files: GPayloadResult.files,
            });

            const existing = this.messages.cache.get(m.id);
            if (existing) {
              const clone = existing._clone();
              clone._patch(m);
              return clone;
            }
            return this.messages._add(m);
        },
    },

    createMessageComponentCollector: {
        value: function(filter, options = {}) {
            options.channelId = this.id;
            options.guildId = this.guild ? this.guild.id : null;

            if (ifDjsV13) {
                options.filter = filter;
                return new InteractionCollectorV13(this.client, filter, options);
            } else {
                return new InteractionCollectorV12(this.client, filter, options);
            }
        },
    },

    awaitMessageComponents: {
        value: function(filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createMessageComponentCollector(filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            });
        },
    },

    createButtonCollector: {
        value: function(msg, filter, options = {}) {
            if (ifDjsV13) return new ButtonCollectorV13(msg, filter, options);
            else return new ButtonCollectorV12(msg, filter, options);
        },
    },

    awaitButtons: {
        value: function(msg, filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createButtonCollector(msg, filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            });
        },
    },

    createSelectMenuCollector: {
        value: function(msg, filter, options = {}) {
            if (ifDjsV13) return new SelectMenuCollectorV13(msg, filter, options);
            else return new SelectMenuCollectorV12(msg, filter, options);
        },
    },

    awaitSelectMenus: {
        value: function(msg, filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createSelectMenuCollector(msg, filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            });
        },
    },
};
