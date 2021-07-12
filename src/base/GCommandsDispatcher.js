const { Collector, Collection, User, Team } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'), ButtonCollectorV13 = require('../structures/v13/ButtonCollector'), SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'), SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector'), Color = require("../structures/Color")
const ifDjsV13 = require("../util/updater").checkDjsVersion("13");
const ms = require("ms");

/**
 * The GCommansDispatcher class
 */
class GCommandsDispatcher {
    constructor(client) {

        /**
         * GCommandsDispatcher options
         * @type {Object} client
        */
        this.client = client;
        this.client.inhibitors = new Set();
        this.client.cooldowns = new Collection();

        this.fetchClientApplication();
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
        if(this.client.application.owners.some(user => user.id == userId)) return { cooldown: false };
        let now = Date.now();

        let cooldown;
        if(typeof command.cooldown == "object") cooldown = command.cooldown ? ms(command.cooldown.cooldown) : ms(this.client.defaultCooldown);
        else cooldown = command.cooldown ? ms(command.cooldown) : ms(this.client.defaultCooldown);

        if(cooldown < 1800000 || !this.client.database) {
            if (!this.client.cooldowns.has(command.name)) {
                this.client.cooldowns.set(command.name, new Collection());
            }

            const timestamps = this.client.cooldowns.get(command.name);
            
            if (timestamps.has(userId)) {
                if (timestamps.has(userId)) {
                    const expirationTime = timestamps.get(userId) + cooldown;
                
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
            setTimeout(() => timestamps.delete(userId), cooldown);
            return { cooldown:false }
        }

        if(!this.client.database || !command.cooldown) return { cooldown: false };

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
     * Internal method to fetchClientApplication
     * @returns {Array}
    */
    async fetchClientApplication() {
        if(!ifDjsV13) this.client.application = await this.client.fetchApplication()
        if(this.client.application.owner == null) return this.client.application.owners = [];
        
        if(this.client.application.owner instanceof Team) {
            this.client.application.owners = this.client.application.owner.members.array().map(teamMember => teamMember.user)
        } else this.client.application.owners = [this.client.application.owner]

        return this.client.application.owners;
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
        if(ifDjsV13) return new ButtonCollectorV13(msg, filter, options);
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

    /**
     * Internal method to createSelectMenuCollector
     * @param {Function} filter 
     * @param {Object} options
     * @returns {Collector}
    */
    createSelectMenuCollector(msg, filter, options = {}) {
        if(ifDjsV13) return new SelectMenuCollectorV13(msg, filter, options);
        else return new SelectMenuCollectorV12(msg, filter, options);
    }

    /**
     * Internal method to createButtonCollector
     * @param {Function} filter 
     * @param {Object} options
     * @returns {Collector}
    */
    awaitSelectMenus(msg, filter, options = {}) {
        return new Promise((resolve, reject) => {
            const collector = this.createSelectMenuCollector(msg, filter, options);
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