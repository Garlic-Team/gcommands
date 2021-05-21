/**
 * The GCommansDispatcher class
 */
class GCommandsDispatcher {
    constructor(client) {

        /**
         * GCommandsDispatcher options
         * @property {Object} client
        */
        this.client = client;
        this.client.inhibitors = new Set();
    }

    /**
     * Internal method to setGuildPrefix
     * @returns {boolean}
    */
    async setGuildPrefix(prefix, guildId) {
        if(!this.client.database || !this.client.database.working) return this.client.prefix;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('./utils/models/guild')

            const settings = await guildSettings.findOne({ id: guildId})
            if(!settings) {
              await guildSettings.create({
                id: guildId,
                prefix: prefix
              })

              return true;
            }

            settings.prefix = prefix
            await settings.save()
            return true;
        } else if(this.client.database.type == "sqlite") {
            this.client.database.sqlite.set(`guildPrefix_${guildId}`,prefix)
            return true;
        } else if(this.client.database.type == "mariadb") {
            this.client.database.mariadb.set(this.client.database.mariadbOptions, guildId, `guildPrefix`, prefix)
            return true;
        } else {
            console.log(new Color("&d[GCommands] &3Don't have database!").getText())
            return false;
        }
    }

    /**
     * Internal method to getGuildPrefix
     * @returns {Stirng}
    */
    async getGuildPrefix(guildId) {
        if(!this.client.database || !this.client.database.working) return this.client.prefix;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('./utils/models/guild')

            const settings = await guildSettings.findOne({ id: guildId})
            if(!settings) {
              return this.client.prefix
            }

            return settings.prefix ? settings.prefix : this.client.prefix
        } else if(this.client.database.type == "sqlite") {
            var settings = this.client.database.sqlite.get(`guildPrefix_${guildId}`)
            return settings ? settings : this.client.prefix;
        } else if(this.client.database.type == "mariadb") {
            var settings = this.client.database.mariadb.get(this.client.database.mariadbOptions, guildId, `guildPrefix`)
            return settings ? settings : this.client.prefix;
        }
    }

    /**
     * Internal method to addInhibitor
     * @returns {boolean}
    */
    async addInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		if(this.client.inhibitors.has(inhibitor)) return false;
		this.client.inhibitors.add(inhibitor);
		return true;
	}

    /**
     * Internal method to removeInhibitor
     * @returns {Set}
    */
    async removeInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		return this.client.inhibitors.delete(inhibitor);
	}
}

module.exports = GCommandsDispatcher;