const {Collection,MessageEmbed,APIMessage} = require("discord.js")

module.exports = {
    /**
     * Internal method to deleteCmd
     * @private
    */
    __deleteCmd: async function(client, commandId, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id)
            if(guildId) {
                app.guilds(guildId)
            }

            await app.commands(commandId).delete()
        } catch(e) {return;}
    },

    /**
     * Internal method to getAllCmds
     * @returns {object}
    */
    __getAllCommands: async function(client, guildId = undefined) {
        const app = client.api.applications(client.user.id)
        if(guildId) {
            app.guilds(guildId)
        }

        return await app.commands.get()
    }
}