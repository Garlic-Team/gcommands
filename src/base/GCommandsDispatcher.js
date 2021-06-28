const { Collector, Collection } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), Color = require("../structures/Color")
const updater = require("../util/updater");
const ms = require("ms")

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
        this.client.cooldowns = new Collection();
    }

    /**
     * Internal method to setGuildPrefix
     * @returns {boolean}
    */
    async setGuildPrefix(guildId, prefix) {
        if(!this.client.database) return false;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {}
        guildData.prefix = prefix

        this.client.database.set(`guild_${guildId}`, guildData)
        this.client.guilds.cache.get(guildId).prefix = guildData.prefix;

        return true;
    }

    /**
     * Internal method to getGuildPrefix
     * @returns {String}
    */
    async getGuildPrefix(guildId, cache = true) {
        if(!this.client.database) return this.client.prefix;
        if(cache) return this.client.guilds.cache.get(guildId).prefix ? this.client.guilds.cache.get(guildId).prefix : this.client.prefix;

        let guildData = await this.client.database.get(`guild_${guildId}`)
        return guildData ? guildData.prefix : this.client.prefix
    }

    /**
     * Internal method to getCooldown
     * @returns {String}
    */
     async getCooldown(guildId, userId, command) {
        if(!command.cooldown) return { cooldown: false } ;
        let now = Date.now();

        let cooldown;
        if(typeof command.cooldown == "object") cooldown = command.cooldown ? ms(command.cooldown.cooldown) : 0;
        else cooldown = command.cooldown ? ms(command.cooldown) : 0;

        if(cooldown < 1800000 || !this.client.database) {
            if (!this.client.cooldowns.has(command.name)) {
                this.client.cooldowns.set(command.name, new Collection());
            }

            const timestamps = this.client.cooldowns.get(command.name);
            const cooldownAmount = cooldown ? cooldown : this.client.defaultCooldown;
            
            if (timestamps.has(userId)) {
                if (timestamps.has(userId)) {
                    const expirationTime = timestamps.get(userId) + cooldownAmount;
                
                    if (now < expirationTime) {
                        if(typeof command.cooldown == "object" && command.cooldown.agressive) {
                            this.client.cooldowns.set(command.name, new Collection());
                            return { cooldown: true, wait: ms(cooldown) }
                        }

                        const timeLeft = ms(expirationTime - now);

                        return { cooldown: true, wait: timeLeft }
                    }
                }
            }

            timestamps.set(userId, now);
            setTimeout(() => timestamps.delete(userId), cooldownAmount);
        }

        if(!this.client.database) return 0;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {}
        if(!guildData.users) guildData.users = {}
        if(!guildData.users[userId]) guildData.users[userId] = guildData.users[userId] || {}

        let userInfo = guildData.users[userId][command.name]

        if(!userInfo) {
            guildData.users[userId][command.name] = ms(command.cooldown) + now
    
            userInfo = guildData.users[userId][command.name]
            this.client.database.set(`guild_${guildId}`, guildData)
        }

        if(now < userInfo) {
            if(typeof command.cooldown == "object" && command.cooldown.agressive) {
                guildData.users[userId][command.name] = ms(command.cooldown) + now
    
                userInfo = guildData.users[userId][command.name]
                this.client.database.set(`guild_${guildId}`, guildData)
                
                return { cooldown: true, wait: ms(cooldown) }
            }

            return {cooldown: true, wait: ms(userInfo - now)}
        } else {
            guildData.users[userId] = guildData.users[userId] || {}
            guildData.users[userId][command.name] = undefined

            this.client.database.set(`guild_${guildId}`, guildData)
        }

        return { cooldown:false }
    }

    /**
     * Internal method to setGuildLanguage
     * @param {Snowflake} guildId
     * @param {Snowflake} userId
     * @param {Object} command
     * @returns {boolean}
    */
    async setGuildLanguage(guildId, lang) {
        if(!this.client.database) return false;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {}
        guildData.language = lang

        this.client.database.set(`guild_${guildId}`, guildData)
        this.client.guilds.cache.get(guildId).language = guildData.language;

        return true;
    }

    /**
     * Internal method to getGuildLanguage
     * @param {Snowflake} guildId
     * @param {Snowflake} userId
     * @param {Object} command
     * @returns {boolean}
    */
     async getGuildLanguage(guildId, cache = true) {
        if(!this.client.database) return this.client.language;
        if(cache) return this.client.guilds.cache.get(guildId).language ? this.client.guilds.cache.get(guildId).language : this.client.language;

        let guildData = await this.client.database.get(`guild_${guildId}`)
        return guildData ? guildData.language : this.client.language
    }

    /**
     * Internal method to addInhibitor
     * @param {Function} inhibitor
     * @returns {boolean}
    */
    addInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log(new Color('&d[GCommands] &cThe inhibitor must be a function.').getText());
		if(this.client.inhibitors.has(inhibitor)) return false;
		this.client.inhibitors.add(inhibitor);
		return true;
	}

    /**
     * Internal method to removeInhibitor
     * @returns {Set}
    */
    removeInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') return console.log(new Color('&d[GCommands] &cThe inhibitor must be a function.').getText());
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