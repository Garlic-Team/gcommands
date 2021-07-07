const { Structures, MessageEmbed, MessageAttachment, TextChannel } = require("discord.js");
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector')
const updater = require("../util/updater");
const GPayload = require("./GPayload");

if(!updater.checkDjsVersion("13")) {
    module.exports = Structures.extend("DMChannel", DMChannel => {
        class GDMChannel extends DMChannel {
            constructor(...args) {
                super(...args)
            }

            async send(result) {
                let GPayloadResult = GPayload.create(this, result)
                    .resolveData()
                    .resolveFiles();

                return this.client.api.channels[this.id].messages.post({
                    data: GPayloadResult.data,
                    files: GPayloadResult.files
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

            createSelectMenuCollector(msg, filter, options = {}) {
                if(updater.checkDjsVersion("13")) return new SelectMenuCollectorV13(msg, filter, options);
                else return new SelectMenuCollectorV12(msg, filter, options);
            }
        
            awaitSelectMenus(msg, filter, options = {}) {
                return new Promise((resolve, reject) => {
                    const collector = this.createSelectMenuCollector(msg, filter, options);
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

        return GDMChannel;
    })
} else module.exports = DMChannel;