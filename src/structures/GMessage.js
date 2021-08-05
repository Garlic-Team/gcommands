const { Message } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const BaseMessageComponent = require('./BaseMessageComponent');
const GPayload = require('./GPayload');
const ifDjsV13 = (require('../util/util')).checkDjsVersion('13');

/**
 * The GMessage class
 * @extends Message
 */
class GMessage {
    constructor() {
        Object.defineProperties(Message.prototype, {
            _patch: {
                value: function(data) {
                    if (data.components && Array.isArray(data.components) && data.components.length > 0) {
                      this.components = data.components.map((c) => BaseMessageComponent.create(c));
                    } else {
                      this.components = [];
                    }
                    return this;
                } 
            },

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
                    }));
        
                    return new Message(this.client, apiMessage, this.channel);
                }
            },
        
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
    }


    /**
     * Edit a message.
     * @param {string|GPayloadOptions} result
     * @returns {Message}
     */
    edit() {}

    /**
     * Update a message.
     * @param {string|GPayloadOptions} result
     * @returns {Message}
     */
    update() {}

    /**
     * Send a message.
     * @param {string|GPayloadOptions} result
     * @returns {Message}
     */
    send() {}

    /**
     * Method to createButtonCollector
     * @param {Function} filter 
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    createButtonCollector() {}

    /**
     * Method to awaitButtons
     * @param {Function} filter 
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    awaitButtons() {}

    /**
     * Method to createSelectMenuCollector
     * @param {Function} filter 
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    createSelectMenuCollector() {}

    /**
     * Method to awaitSelectMenus
     * @param {Function} filter 
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    awaitSelectMenus() {}
}

module.exports = GMessage;
