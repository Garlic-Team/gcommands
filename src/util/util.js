const { APIMessage, MessagePayload, MessageEmbed } = require("discord.js")
const ifDjsV13 = require("../util/updater").checkDjsVersion("13")

module.exports = {
    resolveString(data) {
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data.join('\n');
        return String(data);
    },

    /**
     * Internal method to createAPIMessage
     * @returns {object}
    */
    async createAPIMessage(client, interaction, content) {
        const apiMessage = await ifDjsV13 ? MessagePayload.create(client.channels.resolve(interaction.channel_id), content) : APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
        
        return { ...apiMessage.data, files: apiMessage.files };
    },

    msToSeconds(ms) {
        let seconds = ms / 1000;
        return seconds;
    }
}