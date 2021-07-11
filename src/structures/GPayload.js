const { MessageEmbed, MessageAttachment } = require("discord.js");

class GPayload {
    constructor(channel, options) {
        /**
         * Channel
         * @type {TextChannel | NewsChannel | DMChannel}
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
        if(this.data) return this;
        else this.data = {};

        let type = typeof this.options;
        if(type != "object" || this.options instanceof MessageEmbed || this.options instanceof MessageAttachment) this.options = { content: this.options }

        this.data.inlineReply = this.options.inlineReply == undefined || null ? true : false;

        if(this.options.content && typeof this.options.content == "object") {
            this.data.embeds = this.options.content instanceof MessageEmbed ? this.options.content : [];
            this.options.attachments = this.options.content instanceof MessageAttachment ? this.options.content : [];
        }

        this.data.allowedMentions = this.options.allowedMentions ? this.options.allowedMentions : { parse: [], repliedUser: true }
        this.data.flags = this.options.ephemeral ? 64 : null

        if(this.options.components) this.data.components =!Array.isArray(this.options.components) ? [this.options.components] : this.options.components
        if(this.options.embeds) this.data.embeds = !Array.isArray(this.options.embeds) ? [this.options.embeds] : this.options.embeds
        if(this.options.attachments) this.options.attachments = !Array.isArray(this.options.attachments) ? [this.options.attachments] : this.options.attachments

        if(this.options.inlineReply && this.channel.lastMessageID) this.data.message_reference = { message_id: this.channel.lastMessageID }


        return this;
    }

    /**
     * Resolves files.
     * @returns {GPayload}
     */
    resolveFiles() {
        if (this.files) return this;

        let finalFiles = [];
        if(typeof this.options == "object" && (this.options.attachments || this.options.files)) {
            let attachments = this.options.attachments || this.options.files

            if(!Array.isArray(attachments)) attachments = [attachments]
            attachments.forEach(file => {
                finalFiles.push({
                    attachment: file.attachment,
                    name: file.name,
                    file: file.attachment
                })
            })
        }

        this.files = finalFiles;
        return this;
    }


    /**
     * Creates a `GPayload` from user-level arguments.
     * @param {TextChannel | NewsChannel | DMChannel} channel
     * @param {string|GPayloadOptions} options
     * @returns {GPayload}
     */
    static create(channel, options) {
        return new this(channel, options);
    }
}

module.exports = GPayload;