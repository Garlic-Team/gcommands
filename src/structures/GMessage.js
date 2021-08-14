const { Message, ReactionManager, ClientApplication, MessageFlags, Collection, MessageAttachment, SnowflakeUtil, MessageMentions, MessageEmbed } = require('discord.js');
const { MessageTypes } = require('discord.js').Constants;
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector');
const InteractionCollectorV12 = require('./v12/InteractionCollector');
const InteractionCollectorV13 = require('./v13/InteractionCollector');
const BaseMessageComponent = require('./BaseMessageComponent');
const { InteractionTypes } = require('../util/Constants');
const GPayload = require('./GPayload');
const ifDjsV13 = require('../util/util').checkDjsVersion('13');

/**
 * The GMessage class
 * @extends Message
 */
class GMessage {
    constructor() {
        Object.defineProperties(Message.prototype, {
            _patch: {
                value: function(data, partial = false) {
                    this.id = data.id;

                    if ('type' in data) {
                        this.type = MessageTypes[data.type];
                        this.system = data.type !== 0;
                    } else if (typeof this.type !== 'string') {
                        this.system = null;
                        this.type = null;
                    }

                    if ('content' in data) {
                        this.content = data.content;
                    } else if (typeof this.content !== 'string') {
                        this.content = null;
                    }

                    if ('author' in data) {
                        this.author = ifDjsV13 ? this.client.users._add(data.author, !data.webhook_id) : this.client.users.add(data.author, !data.webhook_id);
                    } else if (!this.author) {
                        this.author = null;
                    }

                    if ('pinned' in data) {
                        this.pinned = Boolean(data.pinned);
                    } else if (typeof this.pinned !== 'boolean') {
                        this.pinned = null;
                    }

                    if ('tts' in data) {
                        this.tts = data.tts;
                    } else if (typeof this.tts !== 'boolean') {
                        this.tts = null;
                    }

                    if (!partial) {
                        this.nonce = 'nonce' in data ? data.nonce : null;
                    }

                    if ('embeds' in data || !partial) {
                        this.embeds = data.embeds ? data.embeds.map(e => new MessageEmbed(e, true)) || [] : [];
                    } else {
                        this.embeds = this.embeds.slice();
                    }

                    if ('components' in data || !partial) {
                        this.components = data.components ? data.components.map(c => BaseMessageComponent.create(c, this.client)) || [] : [];
                    } else {
                        this.components = this.components.slice();
                    }

                    if ('attachments' in data || !partial) {
                        this.attachments = new Collection();
                        if (data.attachments) {
                            for (const attachment of data.attachments) {
                                this.attachments.set(attachment.id, new MessageAttachment(attachment.url, attachment.filename, attachment));
                            }
                        }
                    } else {
                        this.attachments = new Collection(this.attachemnts);
                    }

                    if ('sticker_items' in data || 'stickers' in data || !partial && ifDjsV13) {
                        const { Sticker } = require('discord.js');
                        this.stickers = new Collection(
                            (data.sticker_items || data.stickers) ? (data.sticker_items || data.stickers).map(s => [s.id, new Sticker(this.client, s)]) : null,
                        );
                    } else {
                        this.stickers = new Collection(this.stickers);
                    }

                    if (!partial) {
                        this.createdTimestamp = SnowflakeUtil.deconstruct(this.id).timestamp;
                    }

                    if ('edited_timestamp' in data || !partial) {
                        this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;
                    }

                    if ('reactions' in data || !partial) {
                        this.reactions = new ReactionManager(this);
                        if (data.reactions && data.reactions.length > 0) {
                            for (const reaction of data.reactions) {
                                ifDjsV13 ? this.reactions._add(reaction) : this.reactions.add(reaction);
                            }
                        }
                    }

                    if (!partial) {
                        this.mentions = new MessageMentions(
                            this,
                            (data.mentions instanceof MessageMentions) ? [] : data.mentions,
                            data.mention_roles ,
                            data.mention_everyone,
                            data.mention_channels,
                            data.referenced_message ? data.referenced_message.author : null,
                        );
                    } else {
                        this.mentions = new MessageMentions(
                            this,
                            data.mentions || this.mentions.users,
                            data.mention_roles || this.mentions.roles,
                            data.mention_everyone || this.mentions.everyone,
                            data.mention_channels || this.mentions.crosspostedChannels,
                            data.referenced_message ? data.referenced_message.author : null || this.mentions.repliedUser,
                        );
                    }

                    if ('webhook_id' in data || !partial) {
                        this.webhookId = data.webhook_id || null;
                    }

                    if ('application' in data || !partial) {
                        this.groupActivityApplication = data.application ? new ClientApplication(this.client, data.application) : null;
                    }

                    if ('application_id' in data || !partial) {
                        this.applicationId = data.application_id || null;
                    }

                    if ('activity' in data || !partial) {
                        this.activity = data.activity
                            ? {
                                partyId: data.activity.party_id,
                                type: data.activity.type,
                            }
                            : null;
                    }

                    if ('thread' in data && data.thread !== null) {
                        console.log(data.thread);
                        ifDjsV13 ? this.client.channels._add(data.thread, this.guild) : this.client.channels.add(data.thread, this.guild);
                    }

                    this._edits = [];

                    if (this.member && data.member) {
                        this.member._patch(data.member);
                    } else if (data.member && this.guild && this.author) {
                        ifDjsV13 ? this.guild.members._add(Object.assign(data.member, { user: this.author })) : this.guild.members.add(Object.assign(data.member, { user: this.author }));
                    }

                    if ('flags' in data || !partial) {
                        this.flags = new MessageFlags(data.flags).freeze();
                    } else {
                        this.flags = new MessageFlags(this.flags).freeze();
                    }


                    if ('message_reference' in data || !partial) {
                        this.reference = data.message_reference
                            ? {
                                channelId: data.message_reference.channel_id,
                                guildId: data.message_reference.guild_id,
                                messageId: data.message_reference.message_id,
                            }
                            : null;
                    }

                    if (data.referenced_message) {
                        ifDjsV13 ? this.channel.messages._add(data.referenced_message) : this.channel.messages.add(data.referenced_message);
                    }

                    if (data.interaction) {
                        this.interaction = {
                            id: data.interaction.id,
                            type: InteractionTypes[data.interaction.type],
                            commandName: data.interaction.name,
                            user: ifDjsV13 ? this.client.users._add(data.interaction.user) : this.client.users.add(data.interaction.user),
                        };
                    } else if (!this.interaction) {
                        this.interaction = null;
                    }
                },
            },

            edit: {
                value: async function(result) {
                    let GPayloadResult = await GPayload.create(this.channel, result)
                        .resolveData()
                        .resolveFiles();

                    if (result.edited === false) {
                        return this.client.api.channels(this.channel.id).messages[this.id].patch({
                            data: {
                                type: 7,
                                data: GPayloadResult.data,
                            },
                        }).then(d => this.client.actions.MessageCreate.handle(d).message);
                    }

                    let apiMessage = (await this.client.api.channels(this.channel.id).messages[result.messageId ? result.messageId : this.id].patch({
                        data: GPayloadResult.data,
                    }));

                    return new Message(this.client, apiMessage, this.channel);
                },
            },

            update: {
                value: async function(result) {
                    let GPayloadResult = await GPayload.create(this.channel, result)
                        .resolveData();

                    return this.client.api.channels(this.channel.id).messages[this.id].patch({
                        data: {
                            type: 7,
                            data: GPayloadResult.data,
                        },
                    }).then(d => this.client.actions.MessageCreate.handle(d).message);
                },
            },

            reply: {
                value: async function(result) {
                    if (typeof result === 'string') result = { content: result, inlineReply: this.id };
                    else if (result.inlineReply === undefined || result.inlineReply === true) result.inlineReply = this.id;

                    let GPayloadResult = await GPayload.create(this.channel, result)
                        .resolveData()
                        .resolveFiles();

                    return this.client.api.channels[this.channel.id].messages.post({
                        data: GPayloadResult.data,
                        files: GPayloadResult.files,
                    })
                    .then(d => this.client.actions.MessageCreate.handle(d).message);
                },
            },

            createMessageComponentCollector: {
                value: function(filter, options = {}) {
                    options.messageId = this.id;
                    options.guildId = this.guild.id;

                    if (ifDjsV13) {
                        options.filter = filter;
                        return new InteractionCollectorV13(this.client, options, options);
                    } else {
                        return new InteractionCollectorV12(this.client, filter, options);
                    }
                },
            },

            awaitMessageComponents: {
                value: function(filter, options = {}) {
                    return new Promise((resolve, reject) => {
                        const collector = this.createMessageComponentCollector(filter, options);
                        collector.once('end', (buttons, reason) => {
                            if (options.errors && options.errors.includes(reason)) {
                                reject(buttons);
                            } else {
                                resolve(buttons);
                            }
                        });
                    });
                },
            },

            createButtonCollector: {
                value: function(filter, options = {}) {
                    if (ifDjsV13) return new ButtonCollectorV13(this, filter, options);
                    else return new ButtonCollectorV12(this, filter, options);
                },
            },

            awaitButtons: {
                value: function(filter, options = {}) {
                    return new Promise((resolve, reject) => {
                        const collector = this.client.dispatcher.createButtonCollector(this, filter, options);
                        collector.once('end', (buttons, reason) => {
                            if (options.errors && options.errors.includes(reason)) {
                                reject(buttons);
                            } else {
                                resolve(buttons);
                            }
                        });
                    });
                },
            },

            createSelectMenuCollector: {
                value: function(filter, options = {}) {
                    if (ifDjsV13) return new SelectMenuCollectorV13(this, filter, options);
                    else return new SelectMenuCollectorV12(this, filter, options);
                },
            },

            awaitSelectMenus: {
                value: function(filter, options = {}) {
                    return new Promise((resolve, reject) => {
                        const collector = this.client.dispatcher.createSelectMenuCollector(this, filter, options);
                        collector.once('end', (buttons, reason) => {
                            if (options.errors && options.errors.includes(reason)) {
                                reject(buttons);
                            } else {
                                resolve(buttons);
                            }
                        });
                    });
                },
            },
        });
    }

    /* eslint-disable no-empty-function */
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
     * Method to createMessageComponentCollector
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    createMessageComponentCollector() {}

     /**
      * Method to awaitMessageComponents
      * @param {Function} filter
      * @param {CollectorOptions} options
      * @returns {Collector}
      */
    awaitMessageComponents() {}

    /**
     * Method to createButtonCollector
     * @deprecated
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    createButtonCollector() {}

    /**
     * Method to awaitButtons
     * @deprecated
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    awaitButtons() {}

    /**
     * Method to createSelectMenuCollector
     * @deprecated
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    createSelectMenuCollector() {}

    /**
     * Method to awaitSelectMenus
     * @deprecated
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
     */
    awaitSelectMenus() {}
}

module.exports = GMessage;
