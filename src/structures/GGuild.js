const { Guild } = require('discord.js');

/**
 * The GGuild class
 * @extends Guild
 */
 class GGuild {
    constructor() {
        Object.defineProperties(Guild.prototype, {
            getCommandPrefix: {
                value: async function(cache = true) {
                    let prefix = await this.client.dispatcher.getGuildPrefix(this.id, cache);
                    return prefix || this.client.prefix || [];
                },
            },
            setCommandPrefix: {
                value: function(prefix) {
                    this.client.dispatcher.setGuildPrefix(this.id, prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                },
            },

            getLanguage: {
                value: async function(cache = true) {
                    let language = await this.client.dispatcher.getGuildLanguage(this.id, cache);
                    return language || this.client.language || 'english';
                },
            },
            setLanguage: {
                value: function(lang) {
                    this.client.dispatcher.setGuildLanguage(this.id, lang);
                    this.client.emit('guildLanguageChange', this, lang);
                },
            },
        });
    }

    /* eslint-disable no-empty-function */
    /**
     * Method to getCommandPrefix
     * @param {Boolean} cache
     * @returns {Promise}
    */
    getCommandPrefix() {}

    /**
     * Method to setCommandPrefix
     * @param {string} prefix
     * @returns {void}
    */
    setCommandPrefix() {}

    /**
     * Method to getLanguage
     * @param {Boolean} cache
     * @returns {Promise}
    */
    getLanguage() {}

    /**
     * Method to setLanguage
     * @param {string} lang
     * @returns {void}
    */
    setLanguage() {}
}

module.exports = GGuild;
