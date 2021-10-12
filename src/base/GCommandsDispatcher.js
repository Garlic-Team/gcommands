const { Collection, Team } = require('discord.js');
const Color = require('../structures/Color');

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
    constructor(client, readyWait = true) {
        /**
         * Client
         * @type {GCommandsClient}
         */
        this.client = client;

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
     * Internal method to getUserData
     * @param {Snowflake} userId
     * @param {Object} options
     * @returns {Object}
    */
    async getUserData(userId, options) {
        if (!options.force && typeof this.data === 'object') return this.data;

        let data = await this.client.database.models.User.findOrCreate({ where: { id: userId } });
        if (Array.isArray(data)) data = data[0];

        return data?.id ? data : null;
    }

    /**
     * Internal method to getGuildData
     * @param {Snowflake} guildId
     * @param {Object} options
     * @returns {Object}
    */
    async getGuildData(guildId, options) {
        if (!options.force && typeof this.data === 'object') return this.data;

        let data = await this.client.database.models.Guild.findOrCreate({ where: { id: guildId } });
        if (Array.isArray(data)) data = data[0];

        return data?.id ? data : null;
    }

    /**
     * Internal method to setGuildPrefix
     * @param {Object} guild
     * @param {string} prefix
     * @returns {boolean}
    */
    async setGuildPrefix(guild, prefix) {
        try {
            await guild.getData();
            await guild.data?.update({ prefix: String(prefix) });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to getGuildPrefix
     * @param {Object} guild
     * @returns {string}
    */
    async getGuildPrefix(guild) {
        try {
            await guild.getData();
            const prefix = guild.data?.prefix;
            return prefix ? prefix : null;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to setGuildLanguage
     * @param {Object} guild
     * @param {string} language
     * @returns {boolean}
    */
    async setGuildLanguage(guild, language) {
        try {
            await guild.getData();
            await guild.data?.update({ language: String(language) });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to getGuildLanguage
     * @param {Object} guild
     * @returns {boolean}
    */
    async getGuildLanguage(guild) {
        try {
            await guild.getData();
            const language = guild.data?.language;
            return language ? language : null;
        } catch {
            return false;
        }
    }

    /**
     * Internal method to getCooldown
     * @param {Snowflake} userId
     * @param {Command} command
     * @returns {string}
    */
    getCooldown(userId, command) {
        // If (this.application && this.application.owners.some(user => user.id === userId)) return { cooldown: false };
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
}

module.exports = GCommandsDispatcher;
