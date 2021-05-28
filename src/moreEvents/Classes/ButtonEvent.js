/* From discord-buttons edited */
const {APIMessage, Client} = require("discord.js")
const Color = require("../../utils/color/Color")

/**
 * The ButtonEvent class
 */
class ButtonEvent {

    /**
     * Creates new ButtonEvent instance
     * @param {Client} client
     * @param {Object} data 
    */
    constructor(client, data) {
        this.client = client;

        this.id = data.data.custom_id;

        this.version = data.version;

        this.token = data.token;

        this.discordID = data.id;

        this.applicationID = data.application_id;

        this.guild = data.guild_id ? client.guilds.cache.get(data.guild_id) : undefined;

        this.channel = client.channels.cache.get(data.channel_id);

        this.clicker = {};

        if (this.guild) {
            this.clicker.member = this.guild.members.resolve(data.member.user.id);
            this.clicker.user = this.client.users.resolve(data.member.user.id);
        } else {
            this.clicker.user = this.client.users.resolve(data.user.id);
        }

        this.replied = false;
        this.deferred = false;
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
     * @param {String} content
     * @param {Object} options 
    */
    async edit(result) {
        if (typeof result == "object") {
            var finalData = [];
            result.embeds = [];
            if(!Array.isArray(result.components)) result.components = [[result.components]]
            if(!Array.isArray(result.embeds)) result.embeds = [result.embeds]
            result.components.forEach(option => {
                finalData.push({
                    type: 1,
                    components: option
                })
            })

            if(typeof result.content == "object") {
                result.embeds = [result.content]
                result.content = "\u200B"
            }

            if(result.edited == false) {
                return this.client.api.interactions(this.discordID, this.token).callback.post({
                    data: {
                        type: 7,
                        data: {
                            content: result.content,
                            components: finalData,
                            embeds: result.embeds
                        },
                    },
                });
            }

            await this.client.api.interactions(this.discordID, this.token).callback.post({
                data: {
                    type: 6,
                },
            });

            return this.client.api.webhooks(this.client.user.id, this.token).messages["@original"].patch({ data: {
                content: result.content,
                components: finalData
            }})
        } else {
            await this.client.api.interactions(this.discordID, this.token).callback.post({
                data: {
                    type: 6,
                },
            });

            return this.client.api.webhooks(this.client.user.id, this.token).messages["@original"].patch({ data: {
                content: result,
            }})
        }
    }
}

module.exports = ButtonEvent;