const { APIMessage, Structures } = require('discord.js');
const Color = require("../utils/color/Color")

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
            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            var finalData = [];
            if(!Array.isArray(options.components)) options = [[options.components]]
            options.components.forEach(option => {
                finalData.push({
                    type: 1,
                    components: option
                })
            })

            return this.client.api.channels[this.channel.id].messages.post({
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: finalData,
                    options,
                    embed: options.embed || null
                }
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
            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            var finalData = [];
            if(!Array.isArray(options.components)) options.components = [[options.components]]
            options.components.forEach(option => {
                finalData.push({
                    type: 1,
                    components: option
                })
            })

            return this.client.api.channels[this.channel.id].messages[msgID].patch({
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: finalData,
                    options,
                    embed: options.embed || null
                }
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
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
            if (!options.components) {
                options.components = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: [] };
            }

            var finalData = [];
            if(!Array.isArray(options.components)) options = [[options.components]]
            options.components.forEach(option => {
                finalData.push({
                    type: 1,
                    components: option
                })
            })

            return this.client.api.channels[this.channel.id].messages.post({
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: finalData,
                    message_reference: {
                        message_id: this.channel.lastMessageID
                    },
                    options,
                    embed: options.embed || null
                }
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    }

    return GCommandsMessage;
})