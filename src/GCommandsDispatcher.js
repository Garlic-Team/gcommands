/**
 * The GCommansDispatcher class
 * @class GCommandsDispatcher
 */
module.exports = class GCommandsDispatcher {
    constructor(client) {
        this.client = client;
        this.client.inhibitors = new Set();
    }

    async setGuildPrefix(prefix, guildId) {
        if(!this.client.database || !this.client.database.working) return this.client.prefix;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../utils/models/guild')

            const settings = await guildSettings.findOne({ id: guildId})
            if(!settings) {
              await guildSettings.create({
                id: guildId,
                prefix: prefix
              })

              return;
            }

            settings.prefix = prefix
            await settings.save()
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

    async getGuildPrefix(guildId) {
        if(!this.client.database || !this.client.database.working) return this.client.prefix;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../utils/models/guild')

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

    async addInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		if(this.client.inhibitors.has(inhibitor)) return false;
		this.client.inhibitors.add(inhibitor);
		return true;
	}

    async removeInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		return this.client.inhibitors.delete(inhibitor);
	}
}