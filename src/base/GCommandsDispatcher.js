const { Collection, Team } = require('discord.js');
const Color = require('../structures/Color');
const ms = require('ms');

/**
 * The GCommansDispatcher class
 */
class GCommandsDispatcher {
    /**
     * @param {GCommandsClient} client
     * @constructor
     */
    constructor(client, readyWait = true) {
        /**
         * The client
         * @type {GCommandsClient}
         */
        this.client = client;

        /**
         * All the inhibitors
         * @type {Set}
        */
        this.inhibitors = new Set();

        /**
         * All the cooldowns
         * @type {Collection}
        */
        this.cooldowns = new Collection();

        /**
         * The client application
         * @type {ClientApplication}
        */
        this.application = this.client.application;

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
     * Internal method to get guild data
     * @param {Object} guild
     * @param {Object} options
     * @private
     * @returns {Object | false}
    */
    async getGuildData(guild, options = {}) {
        if (!this.client.database) return false;
        if (guild.data && !options.force) return guild.data;

        try {
            const data = await this.client.database.get(`guild_${guild.id}`) || {};

            return data;
        } catch { return false; }
    }

    /**
     * Internal method to set guild data
     * @param {Object} guild
     * @param {Object} options
     * @private
     * @returns {Object | boolean}
    */
    async setGuildData(guild, data) {
        if (!this.client.database) return false;
        if (!data) return false;

        try {
            await this.client.database.set(`guild_${guild.id}`, data);

            return true;
        } catch { return false; }
    }

    /**
     * Internal method to set guild prefix
     * @param {Object} guild
     * @param {string} prefix
     * @private
     * @returns {boolean}
    */
    async setGuildPrefix(guild, prefix) {
        if (!this.client.database) return false;
        if (!prefix) return false;

        try {
            const data = await guild.getData();

            data.prefix = prefix;

            const isSet = await guild.setData(data);

            return isSet;
        } catch { return false; }
    }

    /**
     * Internal method to get guild prefix
     * @param {Object} guild
     * @param {Object} options
     * @private
     * @returns {string}
    */
    async getGuildPrefix(guild, options = {}) {
        if (!this.client.database) return false;
        if (guild.data?.prefix && !options.force) return guild.data.prefix;

        try {
            const data = await guild.getData({ force: true });

            if (data?.prefix) return data.prefix;
            else return false;
        } catch { return false; }
    }

    /**
     * Internal method to set guild language
     * @param {Object} guild
     * @param {string} language
     * @private
     * @returns {boolean}
    */
    async setGuildLanguage(guild, language) {
        if (!this.client.database) return false;
        if (!language) return false;

        try {
            const data = await guild.getData();

            data.language = language;

            const isSet = await guild.setData(data);

            return isSet;
        } catch { return false; }
    }

    /**
     * Internal method to get guild language
     * @param {Object} guild
     * @param {Object} options
     * @private
     * @returns {boolean}
    */
    async getGuildLanguage(guild, options = {}) {
        if (!this.client.database) return false;
        if (guild.data?.language && !options.force) return guild.data.language;

        try {
            const data = await guild.getData({ force: true });

            if (data?.language) return data.language;
            else return false;
        } catch { return false; }
    }

    /**
     * Internal method to get cooldown
     * @param {Snowflake} userId
     * @param {Command} command
     * @private
     * @returns {Object}
    */
    async getCooldown(userId, guild, command) {
        if (this.application && this.application.owners.some(user => user.id === userId)) return { cooldown: false };
        const now = Date.now();

        let cooldown;
        if (typeof command.cooldown === 'string') cooldown = ms(command.cooldown);
        else cooldown = ms(this.client.defaultCooldown);

        if (cooldown < 1800000 || !this.client.database) {
            if (!this.client.cooldowns.has(command.name)) this.client.cooldowns.set(command.name, new Collection());

            const timestamps = this.client.cooldowns.get(command.name);

            if (timestamps.has(userId)) {
                const expirationTime = timestamps.get(userId);

                if (now > expirationTime) {
                    timestamps.delete(userId);
                } else {
                    const timeLeft = ms(expirationTime - now);
                    return { cooldown: true, wait: timeLeft };
                }
            }
            timestamps.set(userId, (now + cooldown));
            return { cooldown: false };
        } else if (this.client.database) {
            const data = await guild.getData();

            if (!data.users) data.users = {};
            if (!data.users[userId]) data.users[userId] = {};
            if (!data.users[userId]?.cooldowns) data.users[userId].cooldowns = {};

            const cooldowns = data.users[userId].cooldowns;

            if (cooldowns[command.name]) {
                const expirationTime = cooldowns[command.name];

                if (now > expirationTime) {
                    delete cooldowns[command.name];
                } else {
                    const timeLeft = ms(expirationTime - now);
                    return { cooldown: true, wait: timeLeft };
                }
            }
            cooldowns[command.name] = (now + cooldown);
            await guild.setData(data);
            return { cooldown: false };
        }
    }

    /**
     * Internal method to fetch client application
     * @private
     * @returns {Array}
    */
    async fetchClientApplication() {
        this.application = await this.client.application.fetch();

        if (this.application.owner === null) this.application.owners = [];

        if (this.application.owner instanceof Team) {
            this.application.owners = [...this.application.owner.members.values()].map(teamMember => teamMember.user);
        } else { this.application.owners = [this.application.owner]; }

        return this.application.owners;
    }

    /**
     * Method to add inhibitor
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
     * Method to remove inhibitor
     * @param {Inhibitor} inhibitor
     * @returns {Set}
    */
    removeInhibitor(inhibitor) {
        if (typeof inhibitor !== 'function') return console.log(new Color('&d[GCommands] &cThe inhibitor must be a function.').getText());
        return this.client.inhibitors.delete(inhibitor);
    }
}

module.exports = GCommandsDispatcher;
