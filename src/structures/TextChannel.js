const { Structures, MessageEmbed } = require("discord.js");
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), { createAPIMessage } = require("../util/util")
const updater = require("../util/updater")

module.exports = Structures.extend("TextChannel", TextChannel => {
    class GTextChannel extends TextChannel {
        constructor(...args) {
            super(...args)
        }

        async send(result) {
            var data = {}

            let interaction = {
                channel_id: this.id
            }

            if(typeof result != "object") data.content = result;
            if(typeof result == "object" && typeof result.content != "object") data.content = result.content;
            if(typeof result == "object" && typeof result.content == "object") data.embeds = [result.content];
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

            return this.client.api.channels[this.id].messages.post({
                data,
                files: finalFiles
            })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
        }

        createButtonCollector(msg, filter, options = {}) {
            if(updater.checkDjsVersion("13")) return new ButtonCollectorV13(msg, filter, options);
            else return new ButtonCollectorV12(msg, filter, options);
        }
    
        awaitButtons(msg, filter, options = {}) {
            return new Promise((resolve, reject) => {
                const collector = this.createButtonCollector(msg, filter, options);
                collector.once('end', (buttons, reason) => {
                    if (options.errors && options.errors.includes(reason)) {
                        reject(buttons);
                    } else {
                        resolve(buttons);
                    }
                });
            })
        }
    }

    return GTextChannel;
})