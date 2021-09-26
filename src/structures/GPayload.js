const { MessageEmbed, MessageAttachment, DataResolver, Util, MessageFlags } = require('discord.js');
const BaseMessageComponent = require('./BaseMessageComponent');
const { browser } = require('discord.js').Constants;

/**
 * The GPayload class
 */
class GPayload {
    /**
     * Creates new GPayload instance
     * @param {TextChannel | NewsChannel | DMChannel | ThreadChannel} channel
     * @param {string|GPayloadOptions} options
    */
    constructor(channel, options) {
        /**
         * Channel
         * @type {TextChannel | NewsChannel | DMChannel | ThreadChannel}
         */

        this.channel = channel;

        /**
         * Client
         * @type {Client}
         */
        this.client = channel.client;

        /**
         * Options
         * @type {string|GPayloadOptions}
         */
        this.options = options;

        /**
         * Data sendable to the API
         * @type {GPayloadOptions}
         */
        this.data = null;

        /**
         * Files sendable to the API
         * @type {?MessageFile[]}
         */
        this.files = null;
    }

    /**
     * Resolves data.
     * @returns {GPayload}
     */
    resolveData() {
        if (this.data) return this;
        else this.data = {};

        const type = typeof this.options;
        if (type !== 'object' || this.options instanceof MessageEmbed || this.options instanceof MessageAttachment) this.options = { content: this.options };

        const tts = Boolean(this.options.tts);

        let content;
        if (typeof this.options.content === 'object') {
          this.options.embeds = this.options.content instanceof MessageEmbed ? this.options.content : this.options.embeds || [];
          this.options.attachments = this.options.content instanceof MessageAttachment ? this.options.content : this.options.attachments || [];
        } else { content = this.options.content || null; }

        if (this.options.components && !Array.isArray(this.options.components)) this.options.components = Array(this.options.components);
        const components = this.options.components ? this.options.components.map(c => BaseMessageComponent.create(c).toJSON()) : undefined;

        if (this.options.stickers && !Array.isArray(this.options.stickers)) this.options.stickers = Array(this.options.stickers);
        const sticker_ids = this.options.stickers ? this.options.stickers.map(sticker => sticker.id || sticker) : undefined;

        if (this.options.embeds && !Array.isArray(this.options.embeds)) this.options.embeds = Array(this.options.embeds);
        const embeds = this.options.embeds ? this.options.embeds.map(embed => new MessageEmbed(embed).toJSON()) : undefined;

        if (this.options.attachments && !Array.isArray(this.options.attachments)) this.options.attachments = Array(this.options.attachments);
        if (this.options.files && !Array.isArray(this.options.files)) this.options.files = Array(this.options.files);

        let flags = this.options.ephemeral ? MessageFlags.FLAGS.EPHEMERAL : this.options.flags ? new MessageFlags(this.options.flags).bitfield : null;

        let allowedMentions =
          typeof this.options.allowedMentions === 'undefined'
            ? this.client.options.allowedMentions
            : this.options.allowedMentions;

        if (allowedMentions) {
          allowedMentions = Object.assign({}, allowedMentions);
          allowedMentions.replied_user = allowedMentions.repliedUser;
          delete allowedMentions.repliedUser;
        }

        let message_reference;
        if (typeof this.options.reply === 'object' || this.options.inlineReply) {
          const reference = this.options.reply ? this.options.reply.messageReference : this.options.inlineReply;
          const message_id = reference.id || reference || typeof this.options.inlineReply === 'string' ? this.options.inlineReply : (this.channel.lastMessageID || this.channel.lastMessageId) || undefined;
          const fail_if_not_exists = this.options.inlineReply ? this.options.inlineReply.failIfNotExists || this.client.options.failIfNotExists : this.options.reply.failIfNotExists || this.client.options.failIfNotExists;
          if (message_id) {
            message_reference = {
              message_id,
              fail_if_not_exists
            };
          }
        }

        this.data = {
          content,
          tts,
          embeds,
          components,
          allowed_mentions: typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
          flags,
          message_reference,
          attachments: this.options.attachments,
          sticker_ids
        };
        return this;
    }

    /**
     * Resolves files.
     * @returns {GPayload}
     */
    async resolveFiles() {
        if (this.files) return this;

        const finalFiles = [];
        if (this.options.files) this.options.attachments = this.options.files;
        if (this.options.attachments) {
            finalFiles.push(...this.options.attachments);
        }

        if (this.data.embeds) {
          for (const embed of this.data.embeds) {
            if (embed.files) {
              finalFiles.push(...embed.files);
            }
          }
        }

        this.files = await Promise.all(finalFiles.map(f => this.constructor.resolveFile(f)));
        return this;
    }

    /**
     * Resolves a single file into an object sendable to the API.
     * from djs
     * @param {BufferResolvable|Stream|FileOptions|MessageAttachment} fileLike Something that could be resolved to a file
     * @returns {Object}
     */
    static async resolveFile(fileLike) {
        let attachment;
        let name;

        const findName = thing => {
          if (typeof thing === 'string') {
            return Util.basename(thing);
          }

          if (thing.path) {
            return Util.basename(thing.path);
          }

          return 'file.jpg';
        };

        const ownAttachment =
          typeof fileLike === 'string' ||
          fileLike instanceof (browser ? ArrayBuffer : Buffer) ||
          typeof fileLike.pipe === 'function';
        if (ownAttachment) {
          attachment = fileLike;
          name = findName(attachment);
        } else {
          attachment = fileLike.attachment;
          name = fileLike.name || findName(attachment);
        }

        const resource = await DataResolver.resolveFile(attachment);
        return { attachment, name, file: resource };
    }

    /**
     * Creates a `GPayload` from user-level arguments.
     * @param {TextChannel | NewsChannel | DMChannel | ThreadChannel} channel
     * @param {string|GPayloadOptions} options
     * @returns {GPayload}
     */
    static create(channel, options) {
        return new this(channel, options);
    }
}

module.exports = GPayload;
