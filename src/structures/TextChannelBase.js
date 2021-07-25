const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector')
const GPayload = require('./GPayload');
const ifDjsV13 = (require('../util/util')).checkDjsVersion('13');

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
            let GPayloadResult = await GPayload.create(this, result)
                .resolveData()
                .resolveFiles();

            return this.client.api.channels[this.id].messages.post({
                data: GPayloadResult.data,
                files: GPayloadResult.files
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    },

    createButtonCollector: {
        value: async function (msg, filter, options = {}) {
            if(ifDjsV13) return new ButtonCollectorV13(msg, filter, options);
            else return new ButtonCollectorV12(msg, filter, options);
        }
    },

    awaitButtons: {
        value: async function(msg, filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createButtonCollector(msg, filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            })
        }
    },

    createSelectMenuCollector: {
        value: async function(msg, filter, options = {}) {
            if(ifDjsV13) return new SelectMenuCollectorV13(msg, filter, options);
            else return new SelectMenuCollectorV12(msg, filter, options);
        }
    },

    awaitSelectMenus: {
        value: async function(msg, filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createSelectMenuCollector(msg, filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            })
        }
    }
}