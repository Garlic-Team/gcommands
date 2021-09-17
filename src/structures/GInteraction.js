const { Message, SnowflakeUtil } = require('discord.js');
const GError = require('../structures/GError');
const GPayload = require('./GPayload');
const { InteractionTypes, MessageComponentTypes } = require('../util/Constants');
const ifDjsV13 = require('../util/util').checkDjsVersion('13');

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
         * The d.js client
         * @type {Client}
         */
        this.client = client;

        /**
         * The interaction's id
         * @type {Snowflake}
         */
        this.id = data.id;

        /**
         * The interaction's type
         * @type {GInteractionType}
         */
        this.type = InteractionTypes[data.type];

        /**
         * The interaction's token
         * @type {string}
         */
        this.token = data.token;

        /**
         * The version
         * @type {number}
         */
        this.version = data.version;

        /**
         * The application's id
         * @type {number}
         */
        this.applicationId = data.application_id;

        /**
         * The interaction's guild
         * @type {Guild}
         */
        this.guild = data.guild_id ? this.client.guilds.cache.get(data.guild_id) : null;

        /**
         * The interaction's channel
         * @type {TextChannel | NewsChannel | DMChannel | ThreadChannel}
         */
        this.channel = data.guild_id ? this.guild.channels.cache.get(data.channel_id) : client.channels.cache.get(data.channel_id);

        /**
         * The interaction's author
         * @type {User}
         */
        this.user = ifDjsV13 ? this.client.users._add(data.user || data.member.user) : this.client.users.add(data.user || data.member.user);
        this.author = ifDjsV13 ? this.client.users._add(data.user || data.member.user) : this.client.users.add(data.user || data.member.user);

        /**
         * The interaction's member
         * @type {GuildMember | null}
         */
        this.member = data.guild_id ? ifDjsV13 ? this.guild.members._add(data.member) || data.member : this.guild.members.add(data.member) || data.member : null;

        /**
         * Replied
         * @type {boolean}
         * @private
         */
        this._replied = false;

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
     * Indicates whether this interaction is a {@link BaseCommandInteraction} || {@link ContextMenuInteraction}.
     * @returns {boolean}
     */
    isApplication() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
    }

    /**
     * Indicates whether this interaction is a {@link BaseCommandInteraction}.
     * @returns {boolean}
     */
    isCommand() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && String(this.targetType) === 'undefined';
    }

    /**
     * Indicates whether this interaction is a {@link ContextMenuInteraction}.
     * @returns {boolean}
     */
    isContextMenu() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && String(this.targetType) !== 'undefined';
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
     * @param {boolean} ephemeral
    */
    async defer(ephemeral) {
        if (this._replied) throw new GError('[ALREADY REPLY]', 'This interaction already has a reply');
        await this.client.api.interactions(this.id, this.token).callback.post({
            data: {
                type: 6,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });

        this._replied = true;

        let awaitMessage = await this.reply.fetch();
        return awaitMessage;
    }

    /**
     * Method to think
     * @param {boolean} ephemeral
    */
    async think(ephemeral) {
        if (this._replied) throw new GError('[ALREADY REPLY]', 'This interaction already has a reply');
        await this.client.api.interactions(this.id, this.token).callback.post({
            data: {
                type: 5,
                data: {
                    flags: ephemeral ? 1 << 6 : null,
                },
            },
        });

        this._replied = true;

        let awaitMessage = await this.reply.fetch();
        return awaitMessage;
    }

    /**
     * Method to edit
     * @param {Object} options
    */
    edit(result) {
        this.replyEdit(result);
    }

    /**
     * Method to update
     * @param {Object} options
    */
    update(result) {
        this.replyEdit(result, true);
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
        let _send = result => {
            this._replied = true;
            return this.replySend(result);
        };

        /**
         * Method to replyEdit
         * @param {Object} options
         * @memberof reply
        */
        let _edit = result => {
            if (!this._replied) throw new GError('[NEED REPLY]', 'This interaction has no reply.');
            return this.replyEdit(result);
        };

        /**
         * Method to replyUpdate
         * @param {Object} options
         * @memberof reply
        */
        let _update = result => {
            if (!this._replied) throw new GError('[NEED REPLY]', 'This interaction has no reply.');
            return this.replyEdit(result, true);
        };

        /**
         * Method to replyFollowUp
         * @param {Object} options
         * @memberof reply
        */
        let _followUp = result => this.replyFollowUp(result);

        /**
         * Method to replyFetch
         * @param {string} id
         * @memberof reply
        */
        let _fetch = async id => {
            if (!id && !this._replied) throw new GError('[NEED REPLY]', 'This interaction has no reply.');
            let apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages[id ? id : '@original'].get());

            apiMessage.channel_id = this.channel.id;
            return apiMessage.id ? new Message(this.client, apiMessage, this.channel) : apiMessage;
        };

        return {
            send: _send,
            edit: _edit,
            update: _update,
            followUp: _followUp,
            fetch: _fetch,
        };
    }

    async replySend(result) {
        let GPayloadResult = await GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        await this.client.api.interactions(this.id, this.token).callback.post({
            data: {
                type: result.thinking ? 5 : 4,
                data: GPayloadResult.data,
            },
            files: GPayloadResult.files,
        });

        let apiMessage = await this.reply.fetch();
        return apiMessage;
    }

    async replyEdit(result, update) {
        let GPayloadResult = await GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        let apiMessage = {};
        if (update) {
            apiMessage = (await this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: 7,
                    data: GPayloadResult.data,
                },
            }));
        } else {
            apiMessage = (await this.client.api.webhooks(this.client.user.id, this.token).messages[result.messageId ? result.messageId : '@original'].patch({
                data: GPayloadResult.data,
            }));
        }

        apiMessage = await this.reply.fetch();
        return apiMessage;
    }
    async replyFollowUp(result) {
        let GPayloadResult = await GPayload.create(this.channel, result)
            .resolveData()
            .resolveFiles();

        const msg = await this.client.api.webhooks(this.client.user.id, this.token).post({
            type: 4,
            data: GPayloadResult.data,
            files: GPayloadResult.files,
        });

        let apiMessage = await this.reply.fetch(msg.id);
        return apiMessage;
    }
}

module.exports = GInteraction;
