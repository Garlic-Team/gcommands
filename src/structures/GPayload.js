const { MessageEmbed, MessageAttachment, DataResolver, Util } = require('discord.js');
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

        let type = typeof this.options;
        if (type !== 'object' || this.options instanceof MessageEmbed || this.options instanceof MessageAttachment) this.options = { content: this.options };

        this.options.inlineReply = this.options.inlineReply === undefined ? false : this.options.inlineReply;

        if (this.options.content && typeof this.options.content === 'object') {
            this.options.embeds = this.options.content instanceof MessageEmbed ? this.options.content : [];
            this.options.attachments = this.options.content instanceof MessageAttachment ? this.options.content : [];
        } else { this.data.content = this.options.content || null; }

        this.data.allowed_mentions = this.options.allowedMentions ? this.options.allowedMentions : { parse: [], repliedUser: true };
        this.data.flags = this.options.ephemeral ? 64 : null;

        if (this.options.components) this.data.components = !Array.isArray(this.options.components) ? Array(this.options.components) : this.options.components;
        if (this.options.embeds) this.data.embeds = !Array.isArray(this.options.embeds) ? Array(this.options.embeds) : this.options.embeds;
        if (this.options.attachments) this.options.attachments = !Array.isArray(this.options.attachments) ? Array(this.options.attachments) : this.options.attachments;
        if (this.options.files) this.options.files = !Array.isArray(this.options.files) ? Array(this.options.files) : this.options.files;
        if (this.options.stickers) {
          this.options.stickers = !Array.isArray(this.options.stickers) ? this.options.stickers = new Array(this.options.stickers) : this.options.stickers;
          this.data.sticker_ids = this.options.stickers.map(sticker => sticker.id || sticker);
        }

        if (this.options.inlineReply && typeof this.options.inlineReply === 'string') this.data.message_reference = { message_id: this.options.inlineReply };
        else if (typeof this.options.inlineReply === 'boolean' && this.options.inlineReply && (this.channel.lastMessageID || this.channel.lastMessageId)) this.data.message_reference = { message_id: this.channel.lastMessageID || this.channel.lastMessageId };

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
