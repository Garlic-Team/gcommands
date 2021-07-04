const { APIMessage, Structures, Message } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector')
const updater = require("../util/updater")

if(!updater.checkDjsVersion("13")) {
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
             * @param {String} content
             * @param {Object} options
             * @returns {Promise}
            */
            async buttons(content, options) {
                var embed = null;
                if(typeof content == "object") {
                    embed = content;
                    content = "\u200B"
                }
    
    
                if(!options.allowedMentions) {
                    options.allowedMentions = { parse: [] };
                }
    
                if(options.components) {
                    if(!Array.isArray(options.components)) options.components = [options.components];
                    options.components = options.components;
                }
                if(options.embeds) {
                    if(!Array.isArray(options.embeds)) options.embeds = [options.embeds];
                    options.embeds = options.embeds;
                }
    
                let finalFiles = [];
                if(options.attachments) {
                    if(!Array.isArray(options.attachments)) options.attachments = [options.attachments]
                    options.attachments.forEach(file => {
                        finalFiles.push({
                            attachment: file.attachment,
                            name: file.name,
                            file: file.attachment
                        })
                    })
                }
    
                if(options.inlineReply) {
                    options.message_reference = {
                        message_id: this.channel.lastMessageID
                    }
                }

                return this.client.api.channels[this.channel.id].messages.post({
                    data: {
                        allowed_mentions: options.allowedMentions,
                        content: content,
                        components: options.components,
                        options,
                        embed: embed || null
                    },
                    files: finalFiles
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
                var embed = null;
                if(typeof content == "object") {
                    embed = content;
                    content = "\u200B"
                }
    
                if(!options.allowedMentions) {
                    options.allowedMentions = { parse: [] };
                }
    
                if(options.components) {
                    if(!Array.isArray(options.components)) options.components = [options.components];
                    options.components = options.components;
                }
                if(options.embeds) {
                    if(!Array.isArray(options.embeds)) options.embeds = [options.embeds];
                    options.embeds = options.embeds;
                }
    
                let finalFiles = [];
                if(options.attachments) {
                    if(!Array.isArray(options.attachments)) options.attachments = [options.attachments]
                    options.attachments.forEach(file => {
                        finalFiles.push({
                            attachment: file.attachment,
                            name: file.name,
                            file: file.attachment
                        })
                    })
                }
    
                return this.client.api.channels[this.channel.id].messages[msgID].patch({
                    data: {
                        allowed_mentions: options.allowedMentions,
                        content: content,
                        components: options.components,
                        options,
                        embed: embed || null
                    },
                    files: finalFiles
                })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
            }
    
            /**
             * Method to edit message
             * @param {Object} options 
            */
            async edit(result) {
                if (typeof result == "object") {
                    var finalData = [];
    
                    if(result.components && !Array.isArray(result.components)) result.components = [result.components];
                    if(result.embeds && !Array.isArray(result.embeds)) result.embeds = [result.embeds]
    
                    if(typeof result == "object" && !result.content) result.embeds = [result]
                    if(typeof result.content == "object") {
                        result.embeds = [result.content]
                        result.content = "\u200B"
                    }
    
                    if(result.edited == false) {
                        return this.client.api.channels(this.channel.id).messages[this.id].patch({
                            data: {
                                type: 7,
                                data: {
                                    content: result.content,
                                    components: result.components,
                                    embeds: result.embeds
                                },
                            },
                        }).then(d => this.client.actions.MessageCreate.handle(d).message);
                    }
    
                    let finalFiles = [];
                    if(typeof result == "object" && result.attachments) {
                        if(!Array.isArray(result.attachments)) result.attachments = [result.attachments]
                        result.attachments.forEach(file => {
                            finalFiles.push({
                                attachment: file.attachment,
                                name: file.name,
                                file: file.attachment
                            })
                        })
                    }
    
                    return this.client.api.channels(this.channel.id).messages[result.messageId ? result.messageId : this.id].patch({
                        data: {
                            content: result.content,
                            components: result.components || [],
                            embeds: result.embeds || []
                        },
                        files: finalFiles
                    })
                } else {
                    return this.client.api.channels(this.channel.id).messages[this.id].patch({ data: {
                        content: result,
                    }})
                }
            }
    
            /**
             * Method to update message
             * @param {Object} options 
            */
            async update(result) {
                if (typeof result == "object") {
                    var finalData = [];
    
                    if(result.components && !Array.isArray(result.components)) result.components = [result.components];
                    if(result.embeds && !Array.isArray(result.embeds)) result.embeds = [result.embeds]
    
                    if(typeof result == "object" && !result.content) result.embeds = [result]
                    if(typeof result.content == "object") {
                        result.embeds = [result.content]
                        result.content = "\u200B"
                    }
    
                    return this.client.api.channels(this.channel.id).messages[this.id].patch({
                        data: {
                            type: 7,
                            data: {
                                content: result.content,
                                components: result.components,
                                embeds: result.embeds
                            },
                        },
                    }).then(d => this.client.actions.MessageCreate.handle(d).message);
                } else {
                    return this.client.api.channels(this.channel.id).messages[this.id].patch({
                        data: {
                            type: 7,
                            data: {
                                content: result,
                            }
                        }
                    })
                }
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
                if(updater.checkDjsVersion("13")) return new ButtonCollectorV13(this, filter, options);
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
                if(updater.checkDjsVersion("13")) return new SelectMenuCollectorV13(this, filter, options);
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
     * @param {String} content
     * @param {Object} options
     * @returns {Promise}
    */
    buttons: async function(content, options) {
        this.client = options.client, this.channel = options.channel
        var embed = null;
        if(typeof content == "object") {
            embed = content;
            content = "\u200B"
        }


        if(!options.allowedMentions) {
            options.allowedMentions = { parse: [] };
        }

        if(options.components) {
            if(!Array.isArray(options.components)) options.components = [options.components];
            options.components = options.components;
        }
        if(options.embeds) {
            if(!Array.isArray(options.embeds)) options.embeds = [options.embeds];
            options.embeds = options.embeds;
        }

        let finalFiles = [];
        if(options.attachments) {
            if(!Array.isArray(options.attachments)) options.attachments = [options.attachments]
            options.attachments.forEach(file => {
                finalFiles.push({
                    attachment: file.attachment,
                    name: file.name,
                    file: file.attachment
                })
            })
        }

        if(options.inlineReply) {
            options.message_reference = {
                message_id: this.channel.lastMessageID
            }
        }

        return this.client.api.channels[this.channel.id].messages.post({
            data: {
                allowed_mentions: options.allowedMentions,
                content: content,
                components: options.components,
                options,
                embed: embed || null
            },
            files: finalFiles
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
        var embed = null;
        if(typeof content == "object") {
            embed = content;
            content = "\u200B"
        }

        if(!options.allowedMentions) {
            options.allowedMentions = { parse: [] };
        }

        if(options.components) {
            if(!Array.isArray(options.components)) options.components = [options.components];
            options.components = options.components;
        }
        if(options.embeds) {
            if(!Array.isArray(options.embeds)) options.embeds = [options.embeds];
            options.embeds = options.embeds;
        }

        let finalFiles = [];
        if(options.attachments) {
            if(!Array.isArray(options.attachments)) options.attachments = [options.attachments]
            options.attachments.forEach(file => {
                finalFiles.push({
                    attachment: file.attachment,
                    name: file.name,
                    file: file.attachment
                })
            })
        }

        return this.client.api.channels[this.channel.id].messages[msgID].patch({
            data: {
                allowed_mentions: options.allowedMentions,
                content: content,
                components: options.components,
                options,
                embed: embed || null
            },
            files: finalFiles
        })
        .then(d => this.client.actions.MessageCreate.handle(d).message);
    },

    /**
     * Method to inlineReply
     * @param {String} content
     * @param {Object} options
     * @returns {Promise}
    */
    inlineReply: async function(content, options) {
        this.client = options.client, this.channel = options.channel
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
};