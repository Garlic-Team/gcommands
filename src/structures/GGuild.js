const { Guild } = require('discord.js');

/**
 * The GGuild class
 * @extends Guild
 */
class GGuild {
    constructor() {
        Object.defineProperties(Guild.prototype, {
            getCommandPrefix: {
                value: async function() {
                    const prefix = await this.client.dispatcher.getGuildPrefix(this);
                    if (prefix && this.data) this.data.prefix = String(prefix);
                    return prefix || this.client.prefix;
                },
            },
            setCommandPrefix: {
                value: async function(prefix) {
                    const isSet = await this.client.dispatcher.setGuildPrefix(this, prefix);
                    if (isSet && this.data) this.data.prefix = String(prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                },
            },

            getLanguage: {
                value: async function() {
                    const language = await this.client.dispatcher.getGuildLanguage(this);
                    if (language && this.data) this.data.language = String(language);
                    return language || this.client.language || 'english';
                },
            },
            setLanguage: {
                value: async function(lang) {
                    const isSet = await this.client.dispatcher.setGuildLanguage(this, lang);
                    if (isSet && this.data) this.data.language = String(lang);
                    this.client.emit('guildLanguageChange', this, lang);
                },
            },
            getData: {
                value: async function(options = {}) {
                    const data = await this.client.dispatcher.getGuildData(this.id, options);
                    if (data) this.data = data;
                    return data;
                },
            },
        });
    }

    /* eslint-disable no-empty-function */
    /**
     * Method to getCommandPrefix
     * @param {boolean} cache
     * @returns {Promise}
    */
    getCommandPrefix() { }

    /**
     * Method to setCommandPrefix
     * @param {string} prefix
     * @returns {void}
    */
    setCommandPrefix() { }

    /**
     * Method to getLanguage
     * @param {boolean} cache
     * @returns {Promise}
    */
    getLanguage() { }

    /**
     * Method to setLanguage
     * @param {string} lang
     * @returns {void}
    */
    setLanguage() { }

    /**
     * Method to getData
     * @param {object} options
     * @returns {object}
    */
    getData() { }
}

module.exports = GGuild;
