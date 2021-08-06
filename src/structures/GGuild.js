const { Guild } = require('discord.js');

/**
 * The GGuild class
 * @extends Guild
 */
 class GGuild {
    constructor() {
        Object.defineProperties(Guild.prototype, {
            getCommandPrefix: {
                value: function(cache = true) {
                    return this.client.dispatcher.getGuildPrefix(this.id, cache);
                }
            },
            setCommandPrefix: {
                value: function(prefix) {
                    this.client.dispatcher.setGuildPrefix(this.id, prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                }
            },

            getLanguage: {
                value: function(cache = true) { return this.client.dispatcher.getGuildLanguage(this.id, cache); }
            },
            setLanguage: {
                value: function(lang) {
                    this.client.dispatcher.setGuildLanguage(this.id, lang);
                    this.client.emit('guildLanguageChange', this, lang);
                }
            }
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
