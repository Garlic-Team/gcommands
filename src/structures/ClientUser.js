const { User, Structures } = require('discord.js');

/**
 * The ClientUser structure
 * @class ClientUser
 * @private
 */
module.exports = ClientUser => class extends Structures.get("User") {
    async setGuildPrefix(prefix, guildId) {
        if(!this.client.database.working) return;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../models/guild')

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
        } else {
            this.client.database.sqlite.set(`guildPrefix_${guildId}`,prefix)
        }
    }

    async getGuildPrefix(guildId) {
        if(!this.client.database.working) return;
        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../models/guild')

            const settings = await guildSettings.findOne({ id: guildId})
            if(!settings) {
              return this.client.prefix
            }

            return settings.prefix ? settings.prefix : this.client.prefix
        } else {
            var settings = this.client.database.sqlite.get(`guildPrefix_${guildId}`)
            return settings ? settings : this.client.prefix;
        }
    }
}