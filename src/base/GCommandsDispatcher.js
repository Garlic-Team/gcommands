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
     * Internal method to get user data
     * @param {Snowflake} userId
     * @param {Object} options
     * @private
     * @returns {Object || null}
    */
    async getUserData(userId, options) {
        if (!this.client.database) return null;
        if (!options.force && typeof this.data === 'object') return this.data;

        let data = await this.client.database.models.User.findOrCreate({ where: { id: userId } });
        if (Array.isArray(data)) data = data[0];

        return data?.id ? data : null;
    }

    /**
     * Internal method to get guild data
     * @param {Snowflake} guildId
     * @param {Object} options
     * @private
     * @returns {Object || null}
    */
    async getGuildData(guildId, options) {
        if (!this.client.database) return null;
        if (!options.force && typeof this.data === 'object') return this.data;

        let data = await this.client.database.models.Guild.findOrCreate({ where: { id: guildId } });
        if (Array.isArray(data)) data = data[0];

        return data?.id ? data : null;
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
        try {
            await guild.getData();
            await guild.data?.update({ prefix: String(prefix) });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to get guild prefix
     * @param {Object} guild
     * @private
     * @returns {string}
    */
    async getGuildPrefix(guild) {
        if (!this.client.database) return false;
        try {
            await guild.getData();
            const prefix = guild.data?.prefix;
            return prefix ? prefix : null;
        } catch {
            return false;
        }
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
        try {
            await guild.getData();
            await guild.data?.update({ language: String(language) });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to get guild language
     * @param {Object} guild
     * @private
     * @returns {boolean}
    */
    async getGuildLanguage(guild) {
        if (!this.client.database) return false;
        try {
            await guild.getData();
            const language = guild.data?.language;
            return language ? language : null;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to get cooldown
     * @param {Snowflake} userId
     * @param {Command} command
     * @private
     * @returns {Object}
    */
    getCooldown(userId, command) {
        if (this.application && this.application.owners.some(user => user.id === userId)) return { cooldown: false };
        const now = Date.now();

        let cooldown;

        if (typeof command.cooldown === 'object' && command.cooldown?.cooldown) cooldown = ms(command.cooldown.cooldown);
        else if (typeof command.cooldown === 'string') cooldown = ms(command.cooldown);
        else cooldown = ms(this.client.defaultCooldown);

        if (!this.client.cooldowns.has(command.name)) this.client.cooldowns.set(command.name, new Collection());

        const timestamps = this.client.cooldowns.get(command.name);

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

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldown);
        return { cooldown: false };
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
