const { Message } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const GPayload = require('./GPayload');
const ifDjsV13 = (require('../util/updater')).checkDjsVersion('13');

module.exports = Object.defineProperties(Message.prototype, {
    /**
     * Method to edit message
     * @param {Object} options 
    */
    edit: {
        value: async function(result) {
            let GPayloadResult = GPayload.create(this.channel, result)
                .resolveData();

            if(result.edited == false) {
                return this.client.api.channels(this.channel.id).messages[this.id].patch({
                    data: {
                        type: 7,
                        data: GPayloadResult.data
                    },
                }).then(d => this.client.actions.MessageCreate.handle(d).message);
            }

            let apiMessage = (await this.client.api.channels(this.channel.id).messages[result.messageId ? result.messageId : this.id].patch({
                data: GPayloadResult.data
            }))

            if(typeof apiMessage !== 'object') apiMessage = apiMessage.toJSON();
            if(apiMessage) {
                apiMessage.client = this.client ? this.client : client;
                apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
                apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
                apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};
            }

            return apiMessage.id ? new Message(this.client, apiMessage, this.channel) : apiMessage;
        }
    },

    /**
     * Method to update message
     * @param {Object} options 
    */
    update: {
        value: async function(result) {
            let GPayloadResult = GPayload.create(this.channel, result)
                .resolveData();
            
            return this.client.api.channels(this.channel.id).messages[this.id].patch({
                data: {
                    type: 7,
                    data: GPayloadResult.data
                },
            }).then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    },

    /**
     * Method to send
     * @param {Object} result
     * @returns {Promise}
    */
    send: {
        value: async function(result) {
            let GPayloadResult = GPayload.create(this.channel, result)
                .resolveData()
                .resolveFiles();

            return this.client.api.channels[this.channel.id].messages.post({
                data: GPayloadResult.data,
                files: GPayloadResult.files
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    },

    createButtonCollector: {
        value: function(filter, options = {}) {
            if(ifDjsV13) return new ButtonCollectorV13(this, filter, options);
            else return new ButtonCollectorV12(this, filter, options);
        }
    },

    awaitButtons: {
        value: async function(filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.client.dispatcher.createButtonCollector(this, filter, options);
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
        value: function(filter, options = {}) {
            if(ifDjsV13) return new SelectMenuCollectorV13(this, filter, options);
            else return new SelectMenuCollectorV12(this, filter, options);
        }
    },

    awaitSelectMenus: {
        value: async function(filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.client.dispatcher.createSelectMenuCollector(this, filter, options);
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
});