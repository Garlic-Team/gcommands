const { Message } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const GPayload = require('./GPayload');
const ifDjsV13 = (require('../util/util')).checkDjsVersion('13');

/**
 * The GMessage class
 * @extends Message
 */
class GMessage {
    constructor() {
        Object.defineProperties(Message.prototype, {
            /**
             * Edit a message.
             * @param {string|GPayloadOptions} result
             * @returns {Message}
             */
            edit: {
                value: async function(result) {
                    let GPayloadResult = await GPayload.create(this.channel, result)
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
             * Update a message.
             * @param {string|GPayloadOptions} result
             * @returns {Message}
             */
            update: {
                value: async function(result) {
                    let GPayloadResult = await GPayload.create(this.channel, result)
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
             * Send a message.
             * @param {string|GPayloadOptions} result
             * @returns {Message}
             */
            send: {
                value: async function(result) {
                    let GPayloadResult = await GPayload.create(this.channel, result)
                        .resolveData()
                        .resolveFiles();
        
                    return this.client.api.channels[this.channel.id].messages.post({
                        data: GPayloadResult.data,
                        files: GPayloadResult.files
                    })
                    .then(d => this.client.actions.MessageCreate.handle(d).message);
                }
            },
        
            /**
             * Method to createButtonCollector
             * @param {Function} filter 
             * @param {CollectorOptions} options
             * @returns {Collector}
             */
            createButtonCollector: {
                value: function(filter, options = {}) {
                    if(ifDjsV13) return new ButtonCollectorV13(this, filter, options);
                    else return new ButtonCollectorV12(this, filter, options);
                }
            },
        
            /**
             * Method to awaitButtons
             * @param {Function} filter 
             * @param {CollectorOptions} options
             * @returns {Collector}
             */
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
        
            /**
             * Method to createSelectMenuCollector
             * @param {Function} filter 
             * @param {CollectorOptions} options
             * @returns {Collector}
             */
            createSelectMenuCollector: {
                value: function(filter, options = {}) {
                    if(ifDjsV13) return new SelectMenuCollectorV13(this, filter, options);
                    else return new SelectMenuCollectorV12(this, filter, options);
                }
            },
        
            /**
             * Method to awaitSelectMenus
             * @param {Function} filter 
             * @param {CollectorOptions} options
             * @returns {Collector}
             */
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
    }
}

module.exports = GMessage;