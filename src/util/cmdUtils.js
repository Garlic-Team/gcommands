module.exports = {
    /**
     * Internal method to deleteCmd
     * @param {Client} client
     * @param {Number} commandId
     * @param {?Number} guildId
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
     * @param {Client} client
     * @param {Number} guildId
     * @private
    */
    __getAllCommands: async function(client, guildId = undefined) {
        try {
            const app = client.api.applications(client.user.id)
            if(guildId) {
                app.guilds(guildId)
            }

            return await app.commands.get()
        } catch(e) {
            return undefined;
        }
    }
}