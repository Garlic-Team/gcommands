const { APIMessage, Structures, Message } = require('discord.js');

/**
 * The MessageStructure structure
 * @class MessageStructure
 * @private
 */
module.exports = Structures.extend("Message", message => {
    class GCommandsMessage extends Message {
        constructor(...args) {
            super(...args)
        }

        async buttons(content, options) {
            if (!options.buttons) {
                options.buttons = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: ["users", "roles", "everyone"] };
            }

            if (!Array.isArray(options.buttons)) {
                return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
            }

            var buttons = [];
            var styles = ['blupurple', 'grey', 'green', 'red', 'url'];

            options.buttons.forEach((x, i) => {
                if (!x.style) x.style = 'blupurple';

                if (!styles.includes(x.style)) {
                    return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
                }

                if (!x.label) {
                    return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
                }

                if (typeof (x.label) !== 'string') x.label = String(x.label);

                if (x.style === 'url') {
                    if (!x.url) {
                        return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                    }
                } else {
                    if (!x.id) {
                        return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                    }
                }

                var style;

                if (x.style === 'blupurple') {
                    style = 1;
                } else if (x.style === 'grey') {
                    style = 2;
                } else if (x.style === 'green') {
                    style = 3;
                } else if (x.style === 'red') {
                    style = 4;
                } else if (x.style === 'url') {
                    style = 5;
                }

                var data = {
                    type: 2,
                    style: style,
                    label: x.label,
                    custom_id: x.id || null,
                    url: x.url || null
                }

                buttons.push(data);
            })

            options.buttons === null;

            this.client.ws.on('INTERACTION_CREATE', async (data) => {
                let typeStyles = {
                    1: 'blupurple',
                    2: 'grey',
                    3: 'green',
                    4: 'red',
                    5: 'url'
                };

                await this.client.channels.cache.get(data.channel_id).messages.fetch();

                var message;
                try {
                    message = await this.client.channels.cache.get(data.channel_id).messages.cache.get(data.message.id);
                } catch(e) {
                    message = await this.client.channels.cache.get(data.channel_id)
                }

                var clicker = await this.client.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id);

                this.client.emit('clickButton', {
                    version: data.version,
                    type: data.type,
                    style: typeStyles[data.type],
                    token: data.token,
                    id: data.data.custom_id,
                    discordId: data.id,
                    applicationId: data.application_id,
                    clicker: clicker,
                    message
                })
            });

            this.client.api.channels[this.channel.id].messages.post({
                headers: {
                "Content-Type": 'applications/json'
                },
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: [
                        {
                            type: 1,
                            components: buttons
                        }
                    ],
                    options,
                    embed: options.embed || null
                }
            });
        }

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

        async buttonsWithReply(content, options) {
            if (!options.buttons) {
                options.buttons = [];
            }

            if(!options.allowedMentions) {
                options.allowedMentions = { parse: ["users", "roles", "everyone"] };
            }

            if (!Array.isArray(options.buttons)) {
                return console.log(new Color("&d[GCommands] &cThe buttons must be array.",{json:false}).getText());
            }

            var buttons = [];
            var styles = ['blupurple', 'grey', 'green', 'red', 'url'];

            options.buttons.forEach((x, i) => {
                if (!x.style) x.style = 'blupurple';

                if (!styles.includes(x.style)) {
                    return console.log(new Color(`&d[GCommands] &c#${i} button has invalid style, recived ${x.style}`,{json:false}).getText());
                }

                if (!x.label) {
                    return console.log(new Color(`&d[GCommands] &c#${i} don't has label!`,{json:false}).getText());
                }

                if (typeof (x.label) !== 'string') x.label = String(x.label);

                if (x.style === 'url') {
                    if (!x.url) {
                        return console.log(new Color(`&d[GCommands] &cIf the button style is "url", you must provide url`,{json:false}).getText());
                    }
                } else {
                    if (!x.id) {
                        return console.log(new Color(`&d[GCommands] &cIf the button style is not "url", you must provide custom id`,{json:false}).getText());
                    }
                }

                var style;

                if (x.style === 'blupurple') {
                    style = 1;
                } else if (x.style === 'grey') {
                    style = 2;
                } else if (x.style === 'green') {
                    style = 3;
                } else if (x.style === 'red') {
                    style = 4;
                } else if (x.style === 'url') {
                    style = 5;
                }

                var data = {
                    type: 2,
                    style: style,
                    label: x.label,
                    custom_id: x.id || null,
                    url: x.url || null
                }

                buttons.push(data);
            })

            options.buttons === null;

            this.client.ws.on('INTERACTION_CREATE', async (data) => {
                let typeStyles = {
                    1: 'blupurple',
                    2: 'grey',
                    3: 'green',
                    4: 'red',
                    5: 'url'
                };

                await this.client.channels.cache.get(data.channel_id).messages.fetch();

                var message;
                try {
                    message = await this.client.channels.cache.get(data.channel_id).messages.cache.get(data.message.id);
                } catch(e) {
                    message = await this.client.channels.cache.get(data.channel_id)
                }

                var clicker = await this.client.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id);

                this.client.emit('clickButton', {
                    version: data.version,
                    type: data.type,
                    style: typeStyles[data.type],
                    token: data.token,
                    id: data.data.custom_id,
                    discordId: data.id,
                    applicationId: data.application_id,
                    clicker: clicker,
                    message
                })
            });

            this.client.api.channels[this.channel.id].messages.post({
                headers: {
                "Content-Type": 'applications/json'
                },
                data: {
                    allowed_mentions: options.allowedMentions,
                    content: content,
                    components: [
                        {
                            type: 1,
                            components: buttons
                        }
                    ],
                    message_reference: {
                        message_id: this.channel.lastMessageID
                    },
                    options,
                    embed: options.embed || null
                }
            });
        }
    }

    return GCommandsMessage;
})