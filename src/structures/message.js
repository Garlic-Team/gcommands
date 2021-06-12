const { APIMessage, Structures } = require('discord.js');

module.exports = Structures.extend("Message", Message => {
    /**
     * The MessageStructure structure
     * @class
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

            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            if(!Array.isArray(options.components)) options.components = [options.components];
            options.components = options.components;

            if(options.embeds) embed = options.embeds

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

            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            if(!Array.isArray(options.components)) options.components = [options.components];
            options.components = options.components;

            if(options.embeds) embed = options.embeds

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

        /**
         * Method to buttonsWithReply
         * @param {String} content
         * @param {Object} options
         * @returns {Promise}
        */
        async buttonsWithReply(content, options) {
            var embed = null;
            if(typeof content == "object") {
                embed = content;
                content = "\u200B"
            }

            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            if(!Array.isArray(options.components)) options.components = [options.components];
            options.components = options.components;

            if(options.embeds) embed = options.embeds

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

            return this.client.api.channels[this.channel.id].messages.post({
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: options.components,
                    message_reference: {
                        message_id: this.channel.lastMessageID
                    },
                    options,
                    embed: embed || null
                },
                files: finalFiles
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    }

    return GCommandsMessage;
})