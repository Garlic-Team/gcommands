const { Message, SnowflakeUtil } = require('discord.js');
const Color = require('../structures/Color');
const GPayload = require('./GPayload');
const axios = require('axios');
const { checkDjsVersion } = require('../util/util');
const { InteractionTypes, MessageComponentTypes } = require('../util/Constants');
const ifDjsV13 = checkDjsVersion(13);

/**
 * The GInteraction class
 */
class GInteraction {
    /**
     * Creates new GInteraction instance
     * @param {Client} client
     * @param {Object} data
    */
    constructor(client, data) {
        /**
         * Client
         * @type {Client}
         */
        this.client = client;

        /**
         * Type
         * @type {GInteractionType}
         */
        this.type = InteractionTypes[data.type];

        /**
         * Token
         * @type {string}
         */
        this.token = data.token;

        /**
         * DiscordId
         * @type {number}
         */
        this.discordId = data.id;

        /**
         * Version
         * @type {number}
         */
        this.version = data.version;

        /**
         * ApplicationId
         * @type {number}
         */
        this.applicationId = data.application_id;

        /**
         * Guild
         * @type {Guild}
         */
        this.guild = data.guild_id ? this.client.guilds.cache.get(data.guild_id) : null;

        /**
         * Channel
         * @type {TextChannel | NewsChannel | DMChannel}
         */
        this.channel = data.guild_id ? this.guild.channels.cache.get(data.channel_id) : client.channels.cache.get(data.channel_id);

        /**
         * Author
         * @type {User}
         */
        this.author = ifDjsV13 ? this.client.users._add(data.user || data.member.user) : this.client.users.add(data.user || data.member.user);

        /**
         * Member
         * @type {GuildMember | null}
         */
        this.member = data.guild_id ? ifDjsV13 ? this.guild.members._add(data.member) || data.member : this.guild.members.add(data.member) || data.member : null;

        /**
         * Replied
         * @type {boolean}
         */
        this.replied = false;

        return this;
    }

    /**
     * The timestamp the interaction was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    /**
     * The time the interaction was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    /**
     * Indicates whether this interaction is received from a guild.
     * @returns {boolean}
     */
    inGuild() {
        return Boolean(this.guild && this.member);
    }

    /**
     * Indicates whether this interaction is a {@link CommandInteraction}.
     * @returns {boolean}
     */
    isCommand() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
    }

    /**
     * Indicates whether this interaction is a {@link MessageComponentInteraction}.
     * @returns {boolean}
     */
    isMessageComponent() {
        return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT;
    }

    /**
     * Indicates whether this interaction is a {@link ButtonInteraction}.
     * @returns {boolean}
     */
    isButton() {
        return (
        InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
        MessageComponentTypes[this.componentType] === MessageComponentTypes.BUTTON
        );
    }

    /**
     * Indicates whether this interaction is a {@link SelectMenuInteraction}.
     * @returns {boolean}
     */
    isSelectMenu() {
        return (
        InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
        MessageComponentTypes[this.componentType] === MessageComponentTypes.SELECT_MENU
        );
    }

    /**
     * Method to defer
     * @param {Boolean} ephemeral
    */
    async defer(ephemeral) {
        if (this.replied) return console.log(new Color('&d[GCommands] &cThis interaction already has a reply').getText());
        await this.client.api.interactions(this.discordId, this.token).callback.post({
            data: {
                type: 6,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });
        this.replied = true;
    }

    /**
     * Method to think
     * @param {Boolean} ephemeral
    */
    async think(ephemeral) {
        if (this.replied) return console.log(new Color('&d[GCommands] &cThis interaction already has a reply').getText());
        await this.client.api.interactions(this.discordId, this.token).callback.post({
            data: {
                type: 5,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });
        this.replied = true;
    }

    /**
     * Method to edit
     * @param {Object} options
    */
    async edit(result) {
        if (result.autoDefer == true) {
            await this.client.api.interactions(this.discordId, this.token).callback.post({
                data: {
                    type: 6,
                },
            });
        }

        this.slashEdit(result);
    }

    /**
     * Method to update
     * @param {Object} options
    */
    async update(result) {
        if (result.autoDefer == true) {
            await this.client.api.interactions(this.discordId, this.token).callback.post({
                data: {
                    type: 6,
                },
            });
        }

        this.slashEdit(result, true);
    }

    /**
     * Method to reply
     * @type {get}
    */
    get reply() {
        /**
         * Method to replySend
         * @param {Object} options
         * @memberof reply
        */
        let _send = async result => {
            this.replied = true;
            return this.slashRespond(result);
        };

        /**
         * Method to replyEdit
         * @param {Object} options
         * @memberof reply
        */
        let _edit = async result => {
            if (!this.replied) return console.log(new Color('&d[GCommands] &cThis button has no reply.').getText());
            return this.slashEdit(result);
        };

        /**
         * Method to replyUpdate
         * @param {Object} options
         * @memberof reply
        */
        let _update = async result => {
            if (!this.replied) return console.log(new Color('&d[GCommands] &cThis button has no reply.').getText());
            return this.slashEdit(result, true);
        };

        /**
         * Method to replyFetch
         * @param {Object} options
         * @memberof reply
        */
        let _fetch = async () => {
            if (!this.replied) return console.log(new Color('&d[GCommands] &cThis button has no reply.').getText());
            let apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages['@original'].get());

            return new Message(this.client, apiMessage, this.channel);
        };

        return {
            send: _send,
            edit: _edit,
            update: _update,
            fetch: _fetch
        };
    }

    async slashRespond(result) {
        let GPayloadResult = await GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        let apiMessage = (await this.client.api.interactions(this.discordId, this.token).callback.post({
            data: {
                type: result.thinking ? 5 : 4,
                data: GPayloadResult.data
            },
            files: GPayloadResult.files
        }));

        let apiMessageMsg = {};
        try {
            apiMessageMsg = (await axios.get(`https://discord.com/api/v8/webhooks/${this.client.user.id}/${this.token}/messages/@original`)).data;
        } catch (e) {
            apiMessageMsg = {
                id: undefined
            };
        }

        if (typeof apiMessage !== 'object') apiMessage = apiMessage.toJSON();
        if (apiMessage) {
            apiMessage = apiMessageMsg;
            apiMessage.client = this.client;
            apiMessage.createButtonCollector = function createButtonCollector(filter, options) { return this.client.dispatcher.createButtonCollector(apiMessage, filter, options); };
            apiMessage.awaitButtons = function awaitButtons(filter, options) { return this.client.dispatcher.awaitButtons(apiMessage, filter, options); };
            apiMessage.createSelectMenuCollector = function createSelectMenuCollector(filter, options) { return this.client.dispatcher.createSelectMenuCollector(apiMessage, filter, options); };
            apiMessage.awaitSelectMenus = function awaitSelectMenus(filter, options) { return this.client.dispatcher.awaitSelectMenus(apiMessage, filter, options); };
            apiMessage.delete = function deleteMsg() { return this.client.api.webhooks(this.client.user.id, this.token).messages[apiMessageMsg.id].delete(); };
        }

        return apiMessage.id ? new Message(this.client, apiMessage, this.channel) : apiMessage;
    }

    async slashEdit(result, update) {
        let GPayloadResult = await GPayload.create(this.channel, result)
            .resolveData();

        let apiMessage = {};
        if (update) {
            apiMessage = this.client.api.interactions(this.discordId, this.token).callback.post({
                data: {
                    type: 7,
                    data: GPayloadResult.data
                },
            });
        } else {
            apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages[result.messageId ? result.messageId : '@original'].patch({
                data: GPayloadResult.data
            }));
        }

        if (typeof apiMessage !== 'object') apiMessage = apiMessage.toJSON();
        return new Message(this.client, apiMessage, this.channel);
    }
}

module.exports = GInteraction;
