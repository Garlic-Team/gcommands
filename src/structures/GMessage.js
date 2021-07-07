const { APIMessage, Structures, Message, MessagePayload } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const GPayload = require('./GPayload');
const ifDjsV13 = require("../util/updater").checkDjsVersion("13")

if(!ifDjsV13) {
    module.exports = Structures.extend("Message", Message => {
        /**
         * The MessageStructure structure
         * @extends Message
        */
        class GCommandsMessage extends Message {
            constructor(...args) {
                super(...args)
            }
    
            /**
             * Method to make buttons
             * @param {Object | String | MessageEmbed | MessageAttachment} result
             * @returns {Promise}
            */
            async buttons(result) {
                let GPayloadResult = GPayload.create(this.channel, result)
                    .resolveData()
                    .resolveFiles();

                return this.client.api.channels[this.channel.id].messages.post({
                    data: GPayloadResult.data,
                    files: GPayloadResult.files
                })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
            }
    
            /**
             * Method to buttonsEdit
             * @param {String} content
             * @param {Object} options
             * @returns {Promise}
            */
            async buttonsEdit(msgID, content, options) {
                let GPayloadResult = GPayload.create(this.channel, result)
                    .resolveData()
                    .resolveFiles();
    
                return this.client.api.channels[this.channel.id].messages[msgID].patch({
                    data: GPayloadResult.data
                })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
            }
    
            /**
             * Method to edit message
             * @param {Object} options 
            */
            async edit(result) {
                let GPayloadResult = GPayload.create(this.channel, result)
                    .resolveData()
                    .resolveFiles();

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
        
                if(typeof apiMessage != "object") apiMessage = apiMessage.toJSON();
                if(apiMessage) {
                    apiMessage.client = this.client ? this.client : client;
                    apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                    apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                    apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
                    apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
                    apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};
                }
        
                if(ifDjsV13) return apiMessage.id ? new Message(this.client, apiMessage, this.channel) : apiMessage;
                else return apiMessage.id ? new GCommandsMessage(this.client, apiMessage, this.channel) : apiMessage;
            }
    
            /**
             * Method to update message
             * @param {Object} options 
            */
            async update(result) {
                let GPayloadResult = GPayload.create(this.channel, result)
                    .resolveData()
                    .resolveFiles();
                
                return this.client.api.channels(this.channel.id).messages[this.id].patch({
                    data: {
                        type: 7,
                        data: GPayloadResult.data
                    },
                }).then(d => this.client.actions.MessageCreate.handle(d).message);
            }
    
            /**
             * Method to inlineReply
             * @param {String} content
             * @param {Object} options
             * @returns {Promise}
            */
            async inlineReply(content, options) {
                const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
                delete ((options || content || {}).allowedMentions || {}).repliedUser;
    
                const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
                Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });
    
                if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
                apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
                if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
                Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });
    
                if (Array.isArray(apiMessage.data.content)) {
                    return Promise.all(apiMessage.split().map(x => {
                        x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                        return x;
                    }).map(this.inlineReply.bind(this)));
                }
    
                const { data, files } = await apiMessage.resolveFiles();
                return this.client.api.channels[this.channel.id].messages
                    .post({ data, files })
                    .then(d => this.client.actions.MessageCreate.handle(d).message);
            }
    
            createButtonCollector(filter, options = {}) {
                if(ifDjsV13) return new ButtonCollectorV13(this, filter, options);
                else return new ButtonCollectorV12(this, filter, options);
            }
        
            awaitButtons(filter, options = {}) {
                return new Promise((resolve, reject) => {
                    const collector = this.createButtonCollector(this, filter, options);
                    collector.once('end', (buttons, reason) => {
                        if (options.errors && options.errors.includes(reason)) {
                            reject(buttons);
                        } else {
                            resolve(buttons);
                        }
                    });
                })
            }
    
            createSelectMenuCollector(filter, options = {}) {
                if(ifDjsV13) return new SelectMenuCollectorV13(this, filter, options);
                else return new SelectMenuCollectorV12(this, filter, options);
            }
        
            awaitSelectMenus(filter, options = {}) {
                return new Promise((resolve, reject) => {
                    const collector = this.createSelectMenuCollector(this, filter, options);
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
    
        return GCommandsMessage;
    })
} else module.exports = {
    /**
     * Method to make buttons
     * @param {Object | String | MessageEmbed | MessageAttachment} result
     * @returns {Promise}
    */
    buttons: async function(result) {
        this.client = result.client, this.channel = result.channel

        let GPayloadResult = GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        return this.client.api.channels[this.channel.id].messages.post({
            data: GPayloadResult.data,
            files: GPayloadResult.files
        })
        .then(d => this.client.actions.MessageCreate.handle(d).message);
    },

    /**
     * Method to buttonsEdit
     * @param {String} content
     * @param {Object} options
     * @returns {Promise}
    */
    buttonsEdit: async function(msgID, content, options) {
        this.client = options.client, this.channel = options.channel

        let GPayloadResult = GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        return this.client.api.channels[this.channel.id].messages[msgID].patch({
            data: GPayloadResult.data,
            files: GPayloadResult.files
        })
        .then(d => this.client.actions.MessageCreate.handle(d).message);
    },
};