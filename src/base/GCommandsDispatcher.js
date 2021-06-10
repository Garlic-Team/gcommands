const { Collector } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector')
const updater = require("../util/updater");

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
        this.client.guilds.cache.get(guildId).prefix = prefix;

        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../util/models/guild')

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
    async getGuildPrefix(guildId, cache = true) {
        if(!this.client.database || !this.client.database.working) return this.client.prefix;
        if(cache) return this.client.guilds.cache.get(guildId).prefix ? this.client.guilds.cache.get(guildId).prefix : this.client.prefix;

        if(this.client.database.type = "mongodb") {
            var guildSettings = require('../util/models/guild')

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
     * Internal method to getCooldown
     * @returns {Stirng}
    */
     async getCooldown(guildId, userId, cmdName) {
        if(!this.client.database || !this.client.database.working) return 0;

        if(this.client.database.type = "mongodb") {
            var user = require('../util/models/user')

            const settings = await user.findOne({ id: userId, guild: guildId })
            if(!settings) {
              return 0
            }

            return settings.cooldown
        } else if(this.client.database.type == "sqlite") {
            var settings = this.client.database.sqlite.get(`guild_${guildId}_${userId}`)
            return settings ? settings : this.client.prefix;
        } else if(this.client.database.type == "mariadb") {
            var settings = this.client.database.mariadb.get(this.client.database.mariadbOptions, guildId + "##" + userId, `guildCooldown`)
            return settings ? settings : this.client.prefix;
        }
    }

    /**
     * Internal method to addInhibitor
     * @param {Function} inhibitor
     * @returns {boolean}
    */
    addInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		if(this.client.inhibitors.has(inhibitor)) return false;
		this.client.inhibitors.add(inhibitor);
		return true;
	}

    /**
     * Internal method to removeInhibitor
     * @returns {Set}
    */
    removeInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log('&d[GCommands] &cThe inhibitor must be a function.');
		return this.client.inhibitors.delete(inhibitor);
	}

    /**
     * Internal method to createButtonCollector
     * @param {Function} filter 
     * @param {Object} options
     * @returns {Collector}
    */
    createButtonCollector(msg, filter, options = {}) {
        if(updater.checkDjsVersion("13")) return new ButtonCollectorV13(msg, filter, options);
        else return new ButtonCollectorV12(msg, filter, options);
    }

    /**
     * Internal method to createButtonCollector
     * @param {Function} filter 
     * @param {Object} options
     * @returns {Collector}
    */
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

module.exports = GCommandsDispatcher;