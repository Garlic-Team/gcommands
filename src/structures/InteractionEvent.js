/* From discord-buttons edited */
const { default: axios } = require("axios");
const {Client, MessageEmbed, Guild, NewsChannel, GuildMember, User} = require("discord.js")
const Color = require("../structures/Color"), { createAPIMessage } = require("../util/util");
const GMessage = require("./GMessage");

/**
 * The InteractionEvent class
 */
class InteractionEvent {

    /**
     * Creates new InteractionEvent instance
     * @param {Client} client
     * @param {Object} data 
    */
    constructor(client, data) {
        this.client = client;

        /**
         * selectMenuId
         * @deprecated
         */
        this.selectMenuId = data.data.values ? data.data.custom_id : undefined;

        /**
         * selectMenuId
         * @deprecated
         */
        this.valueId = data.data.values ? data.data.values : undefined;

        /**
         * id
         * @type {Number}
         */
        this.id = data.data.custom_id;

        /**
         * values
         * @type {Array}
         */
        this.values = data.data.values ? data.data.values : undefined

        /**
         * version
         * @type {Number}
         */
        this.version = data.version;

        /**
         * token
         * @type {String}
         */
        this.token = data.token;

        /**
         * discordID
         * @type {Number}
         */
        this.discordID = data.id;

        /**
         * applicationID
         * @type {Number}
         */
        this.applicationID = data.application_id;

        /**
         * guild
         * @type {Guild}
         */
        this.guild = data.guild_id ? client.guilds.cache.get(data.guild_id) : undefined;

        /**
         * channel
         * @type {TextChannel | NewsChannel | DMChannel}
         */
        this.channel = client.channels.cache.get(data.channel_id);

        /**
         * clicker
         * @type {GuildMember | User | Number}
         */
        this.clicker = {
            member: this.guild ? this.guild.members.cache.get(data.member.user.id) : undefined,
            user: this.client.users.cache.get(data.guild_id ? data.member.user.id : data.user.id),
            id: data.guild_id ? data.member.user.id : data.member.user.id,
        };

        /**
         * message
         * @type {GMessage}
         */
        this.message = new GMessage(this.client, data.message, this.channel);

        /**
         * replied
         * @type {boolean}
         */
        this.replied = false;

        /**
         * deferred
         * @type {boolean}
         */
        this.deferred = false;
    }

    /**
     * Method to defer
     * @param {Boolean} ephemeral 
    */
    async defer(ephemeral) {
        if (this.deferred || this.replied) return console.log(new Color('&d[GCommands] &cThis button already has a reply').getText());
        await this.client.api.interactions(this.discordID, this.token).callback.post({
            data: {
                type: 6,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });
        this.deferred = true;
    }

    /**
     * Method to think
     * @param {Boolean} ephemeral 
    */
    async think(ephemeral) {
        if (this.deferred || this.replied) return console.log(new Color('&d[GCommands] &cThis button already has a reply').getText());
        await this.client.api.interactions(this.discordID, this.token).callback.post({
            data: {
                type: 5,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });
        this.deferred = true;
    }

    /**
     * Method to edit
     * @param {Object} options 
    */
    async edit(result) {
        if(result.autoDefer == true) {
            await this.client.api.interactions(this.discordID, this.token).callback.post({
                data: {
                    type: 6,
                },
            });
        }

        this.slashEdit(result)
    }

    /**
     * Method to update
     * @param {Object} options 
    */
    async update(result) {
        if(result.autoDefer == true) {
            await this.client.api.interactions(this.discordID, this.token).callback.post({
                data: {
                    type: 6,
                },
            });
        }

        this.slashEdit(result, true)
    }

    /**
     * Method to reply
    */
    get reply() {
        /**
         * Method to replySend
         * @param {Object} options 
        */
        let _send = async(result) => {
            this.replied = true;
            this.slashRespond(result)
        }

        /**
         * Method to replyEdit
         * @param {Object} options 
        */
         let _edit = async(result) => {
            if(!this.replied) return console.log(new Color("&d[GCommands] &cThis button has no reply.").getText())
            this.slashEdit(result)
        }

        /**
         * Method to replyUpdate
         * @param {Object} options 
        */
         let _update = async(result) => {
            if(!this.replied) return console.log(new Color("&d[GCommands] &cThis button has no reply.").getText())
            this.slashEdit(result, true)
        }

        /**
         * Method to replyFetch
         * @param {Object} options 
        */
        let _fetch = async() => {
            if(!this.replied) return console.log(new Color("&d[GCommands] &cThis button has no reply.").getText())
            let apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages["@original"].get());

            if(apiMessage) {
                apiMessage.client = this.client;
                apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
                apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
                apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};
            }

            return new GMessage(this.client, apiMessage, this.channel);
        }

        return {
            send: _send,
            edit: _edit,
            update: _update,
            fetch: _fetch
        }
    }

    async slashRespond(result) {
        var data = {
            content: result
        }

        if (typeof result === 'object') {
            if(typeof result == "object" && !result.content) {
                const embed = new MessageEmbed(result)
                data = await createAPIMessage(this.client, interaction, embed)
            }
            else if(typeof result.content == "object" ) {
                const embed = new MessageEmbed(result.content)
                data = await createAPIMessage(this.client, interaction, embed)
            } else data = { content: result.content }
        }

        if(typeof result == "object" && result.allowedMentions) { data.allowedMentions = result.allowedMentions } else data.allowedMentions = { parse: [], repliedUser: true }
        if(typeof result == "object" && result.ephemeral) { data.flags = 64 }
        if(typeof result == "object" && result.components) {
            if(!Array.isArray(result.components)) result.components = [result.components];
            data.components = result.components;
        }
        if(typeof result == "object" && result.embeds) {
            if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]
            data.embeds = result.embeds;
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

        let apiMessage = (await this.client.api.interactions(this.discordID, this.token).callback.post({
            data: {
                type: result.thinking ? 5 : 4,
                data
            },
            files: finalFiles
        })).toJSON();

        let apiMessageMsg = {};
        try {
            apiMessageMsg = (await axios.get(`https://discord.com/api/v8/webhooks/${this.client.user.id}/${interaction.token}/messages/@original`)).data;
        } catch(e) {
            apiMessage = {
                id: undefined
            }
        }

        if(apiMessage) {
            apiMessage = apiMessageMsg;
            apiMessage.client = this.client ? this.client : client;
            apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
            apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
            apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
            apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
            apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessageMsg.id].delete()};
        }

        return apiMessage
    }

    async slashEdit(result, update) {
        if (typeof result == "object") {
            if(result.components) {
                if(!Array.isArray(result.components)) result.components = [result.components];

                result.components = result.components;
            } else result.components = [];

            if(typeof result.content == "object") {
                result.embeds = [result.content]
                result.content = "\u200B"
            }
            if(typeof result == "object" && result.embeds) {
                if(!Array.isArray(result.embeds)) result.embeds = [result.embeds];
                result.embeds = result.embeds;
            } else result.embeds = []
            if(result.embeds && !result.content) result.content = "\u200B"
            
            let apiMessage = {};
            if(update) {
                apiMessage = (await this.client.api.interactions(this.discordID, this.token).callback.post({
                    data: {
                        type: 7,
                        data: {
                            content: result.content,
                            components: result.components,
                            embeds: result.embeds || []
                        }
                    }
                })).toJSON();
            } else {
                apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages[result.messageId ? result.messageId : "@original"].patch({
                    data: {
                        content: result.content,
                        components: result.components,
                        embeds: result.embeds || []
                    } 
                })).toJSON();
            }

            if(apiMessage) {
                apiMessage.client = this.client;
                apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
                apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
                apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
                apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
                apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};
            }
            return apiMessage;
        }

        let apiMessage;
        if(update) {
            apiMessage = (await this.client.api.interactions(this.discordID, this.token).callback.post({
                data: {
                    data: {
                        content: result,
                    },
                    type: 7
                },
            })).toJSON();
        } else {
            apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages[result.messageId ? result.messageId : "@original"].patch({
                data: {
                    content: result,
                } 
            })).toJSON();
        }

        if(apiMessage) {
            apiMessage.client = this.client;
            apiMessage.createButtonCollector = function createButtonCollector(filter, options) {return this.client.dispatcher.createButtonCollector(apiMessage, filter, options)};
            apiMessage.awaitButtons = function awaitButtons(filter, options) {return this.client.dispatcher.awaitButtons(apiMessage, filter, options)};
            apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) {return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options)};
            apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) {return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options)};
            apiMessage.delete = function deleteMsg() {return this.client.api.webhooks(this.client.user.id, interaction.token).messages[apiMessage.id].delete()};
        }

        return apiMessage;
    }

    /**
     * Method to isSelectMenu
    */
    async isSelectMenu() {
        return data.data.values ? true : false;
    }

    /**
     * Method to isButton
    */
    async isButton() {
        return data.data.values ? false : true;
    }
}

module.exports = InteractionEvent;