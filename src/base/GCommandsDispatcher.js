const { Collection, Team } = require('discord.js');
const ButtonCollectorV12 = require('../structures/v12/ButtonCollector'),
    ButtonCollectorV13 = require('../structures/v13/ButtonCollector'),
    SelectMenuCollectorV12 = require('../structures/v12/SelectMenuCollector'),
    SelectMenuCollectorV13 = require('../structures/v13/SelectMenuCollector'),
    Color = require('../structures/Color');

const ifDjsV13 = require('../util/util').checkDjsVersion('13');
const ms = require('ms');

/**
 * The GCommansDispatcher class
 */
class GCommandsDispatcher {
    /**
     * The GCommansDispatcher class
     * @param {GCommandsClient} GCommandsClient
     */
    constructor(GCommandsClient, readyWait = true) {
        /**
         * GCommandsClient
         * @type {GCommands}
        */
         this.GCommandsClient = GCommandsClient;

        /**
         * Client
         * @type {Client}
         */
        this.client = this.GCommandsClient.client;

        /**
         * Inhibitors
         * @type {Set}
        */
        this.inhibitors = new Set();

        /**
         * Cooldowns
         * @type {Collection}
        */
        this.cooldowns = new Collection();

        /**
         * Application
         * @type {ClientApplication}
        */
        this.application = null;

        this.client.inhibitors = this.inhibitors;
        this.client.cooldowns = this.cooldowns;

        if (readyWait) {
            setImmediate(() => {
                this.client.on('ready', () => {
                    this.fetchClientApplication();
                });
            });
        }
    }

    /**
     * Internal method to setGuildPrefix
     * @param {Snowflake} guildId
     * @param {string|Array} prefix
     * @returns {boolean}
    */
    async setGuildPrefix(guildId, prefix) {
        if (!this.client.database) return false;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {};
        guildData.prefix = !Array.isArray(prefix) ? Array(prefix) : prefix;

        this.client.database.set(`guild_${guildId}`, guildData);
        this.client.guilds.cache.get(guildId).prefix = guildData.prefix;

        return true;
    }

    /**
     * Internal method to getGuildPrefix
     * @param {Snowflake} guildId
     * @param {Boolean} cache
     * @returns {string}
    */
    async getGuildPrefix(guildId, cache = true) {
        if (!Array.isArray(this.client.prefix)) this.client.prefix = Array(this.client.prefix);

        if (!this.client.database) return this.client.prefix;

        let guild = this.client.guilds.cache.get(guildId);
        if (guild.prefix && !Array.isArray(guild.prefix)) guild.prefix = Array(guild.prefix);
        else cache = false;

        if (cache) return guild.prefix ? guild.prefix : this.client.prefix;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {};
        if (guildData.prefix && !Array.isArray(guildData.prefix)) guildData.prefix = Array(guildData.prefix);

        return guildData ? guildData.prefix : this.client.prefix;
    }

    /**
     * Internal method to getCooldown
     * @param {Snowflake} guildId
     * @param {Snowflake} userId
     * @param {Command} command
     * @returns {String}
    */
    async getCooldown(guildId, userId, command) {
        if (this.application && this.application.owners.some(user => user.id === userId)) return { cooldown: false };
        let now = Date.now();

        let cooldown;
        if (typeof command.cooldown === 'object') cooldown = command.cooldown ? ms(command.cooldown.cooldown) : ms(this.client.defaultCooldown);
        else cooldown = command.cooldown ? ms(command.cooldown) : ms(this.client.defaultCooldown);

        if (cooldown < 1800000 || !this.client.database) {
            if (!this.client.cooldowns.has(command.name)) this.client.cooldowns.set(command.name, new Collection());

            const timestamps = this.client.cooldowns.get(command.name);

            if (timestamps.has(userId)) {
                if (timestamps.has(userId)) {
                    const expirationTime = timestamps.get(userId) + cooldown;

                    if (now < expirationTime) {
                        if (typeof command.cooldown === 'object' && command.cooldown.agressive) {
                            this.client.cooldowns.set(command.name, new Collection());
                            return { cooldown: true, wait: ms(cooldown) };
                        }

                        const timeLeft = ms(expirationTime - now);

                        return { cooldown: true, wait: timeLeft };
                    }
                }
            }

            timestamps.set(userId, now);
            setTimeout(() => timestamps.delete(userId), cooldown);
            return { cooldown: false };
        }

        if (!this.client.database || !command.cooldown) return { cooldown: false };

        let guildData = await this.client.database.get(`guild_${guildId}`) || {};
        if (!guildData.users) guildData.users = {};
        if (!guildData.users[userId]) guildData.users[userId] = guildData.users[userId] || {};

        let userInfo = guildData.users[userId][command.name];

        if (!userInfo) {
            guildData.users[userId][command.name] = ms(command.cooldown) + now;

            userInfo = guildData.users[userId][command.name];
            this.client.database.set(`guild_${guildId}`, guildData);
        }

        if (now < userInfo) {
            if (typeof command.cooldown === 'object' && command.cooldown.agressive) {
                guildData.users[userId][command.name] = ms(command.cooldown) + now;

                userInfo = guildData.users[userId][command.name];
                this.client.database.set(`guild_${guildId}`, guildData);

                return { cooldown: true, wait: ms(cooldown) };
            }

            return { cooldown: true, wait: ms(userInfo - now) };
        } else {
            guildData.users[userId] = guildData.users[userId] || {};
            guildData.users[userId][command.name] = undefined;

            this.client.database.set(`guild_${guildId}`, guildData);
        }

        return { cooldown: false };
    }

    /**
     * Internal method to setGuildLanguage
     * @param {Snowflake} guildId
     * @param {string} lang
     * @returns {boolean}
    */
    async setGuildLanguage(guildId, lang) {
        if (!this.client.database) return false;

        let guildData = await this.client.database.get(`guild_${guildId}`) || {};
        guildData.language = lang;

        this.client.database.set(`guild_${guildId}`, guildData);
        this.client.guilds.cache.get(guildId).language = guildData.language;

        return true;
    }

    /**
     * Internal method to getGuildLanguage
     * @param {Snowflake} guildId
     * @param {Boolean} cache
     * @returns {boolean}
    */
    async getGuildLanguage(guildId, cache = true) {
        if (!this.client.database) return this.client.language;
        if (cache) return this.client.guilds.cache.get(guildId).language ? this.client.guilds.cache.get(guildId).language : this.client.language;

        let guildData = await this.client.database.get(`guild_${guildId}`);
        return guildData ? guildData.language : this.client.language;
    }

    /**
     * Internal method to fetchClientApplication
     * @private
     * @returns {Array}
    */
    async fetchClientApplication() {
        if (!ifDjsV13) this.application = await this.client.fetchApplication();
        else this.application = await this.client.application.fetch();

        if (this.application.owner === null) this.application.owners = [];

        if (this.application.owner instanceof Team) {
            this.application.owners = [...this.application.owner.members.values()].map(teamMember => teamMember.user);
        } else { this.application.owners = [this.application.owner]; }

        return this.application.owners;
    }

    /**
     * Method to addInhibitor
     * @param {Inhibitor} inhibitor
     * @returns {boolean}
    */
    addInhibitor(inhibitor) {
		if (typeof inhibitor !== 'function') return console.log(new Color('&d[GCommands] &cThe inhibitor must be a function.').getText());
		if (this.client.inhibitors.has(inhibitor)) return false;
		this.client.inhibitors.add(inhibitor);
		return true;
	}

    /**
     * Method to removeInhibitor
     * @param {Inhibitor} inhibitor
     * @returns {Set}
    */
    removeInhibitor(inhibitor) {
		if (typeof inhibitor !== 'function') return console.log(new Color('&d[GCommands] &cThe inhibitor must be a function.').getText());
		return this.client.inhibitors.delete(inhibitor);
	}

    /**
     * Method to createButtonCollector
     * @param {Message} msg
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
    */
    createButtonCollector(msg, filter, options = {}) {
        if (ifDjsV13) return new ButtonCollectorV13(msg, filter, options);
        else return new ButtonCollectorV12(msg, filter, options);
    }

    /**
     * Method to awaitButtons
     * @param {Message} msg
     * @param {Function} filter
     * @param {CollectorOptions} options
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
        });
    }

    /**
     * Method to createSelectMenuCollector
     * @param {Message} msg
     * @param {Function} filter
     * @param {CollectorOptions} options
     * @returns {Collector}
    */
    createSelectMenuCollector(msg, filter, options = {}) {
        if (ifDjsV13) return new SelectMenuCollectorV13(msg, filter, options);
        else return new SelectMenuCollectorV12(msg, filter, options);
    }

    /**
     * Method to awaitSelectMenus
     * @param {Message} msg
     * @param {Function} filter
     * @param {CollectorOptions} options
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
        });
    }
}

module.exports = GCommandsDispatcher;
