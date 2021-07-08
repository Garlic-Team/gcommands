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

        if(typeof this.options != "object") this.data.content = this.options;
        if(typeof this.options == "object" && this.options.inlineReply == undefined) this.data.inlineReply = true;
        if(typeof this.options == "object" && !this.options.content && this.options instanceof MessageEmbed) this.data.embeds = [this.options];
        if(typeof this.options == "object" && !this.options.content && this.options instanceof MessageAttachment) this.options.attachments = [this.options];
        if(typeof this.options == "object" && typeof this.options.content != "object") this.data.content = this.options.content;
        if(typeof this.options == "object" && typeof this.options.content == "object" && this.options.content instanceof MessageEmbed) this.data.embeds = [this.options.content];
        if(typeof this.options == "object" && typeof this.options.content == "object" && this.options.content instanceof MessageAttachment) this.data.attachments = [this.options.content];
        if(typeof this.options == "object" && this.options.allowedMentions) { this.data.allowedMentions = this.options.allowedMentions } else this.data.allowedMentions = { parse: [], repliedUser: true }
        if(typeof this.options == "object" && this.options.ephemeral) { this.data.flags = 64 }
        if(typeof this.options == "object" && this.options.inlineReply && this.channel.lastMessageID) this.data.message_reference = { message_id: this.channel.lastMessageID }
        if(typeof this.options == "object" && this.options.components) {
            if(!Array.isArray(this.options.components)) this.options.components = [this.options.components];
            this.data.components = this.options.components;
        }
        if(typeof this.options == "object" && this.options.embeds) {
            if(!Array.isArray(this.options.embeds)) this.options.embeds = [this.options.embeds]
            this.data.embeds = this.options.embeds;
        }

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