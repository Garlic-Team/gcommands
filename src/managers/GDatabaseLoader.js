const Color = require("../structures/Color")

class GDatabaseLoader {
    constructor(GCommandsClient) {
        this.GCommandsClient = GCommandsClient;
        this.client = this.GCommandsClient.client;

        this.__loadDB()
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    async __loadDB() {
        let dbType = this.GCommandsClient.database;
        if(!dbType) this.client.database = undefined;
        else { 
            const Keyv = require('keyv');
            this.client.database = new Keyv(dbType)
        }

        this.__guildConfig()
    }

    async __guildConfig() {
        this.client.guilds.cache.forEach(async (guild) => {
            let prefix = await this.client.dispatcher.getGuildPrefix(guild.id, false)
            guild.prefix = prefix;
        })

        this.client.on("guildCreate", (guild) => {guild.prefix = this.client.dispatcher.getGuildPrefix(guild.id, false)})
    }
}

module.exports = GDatabaseLoader;