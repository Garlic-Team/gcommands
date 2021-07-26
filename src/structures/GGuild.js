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
                    return this.client.dispatcher.getGuildPrefix(this.id, cache)
                }
            },
            setCommandPrefix: {
                value: async function(prefix)  {
                    this.client.dispatcher.setGuildPrefix(this.id, prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                }
            },

            getLanguage: {
                value: async function(cache = true) { return this.client.dispatcher.getGuildLanguage(this.id, cache) }
            },
            setLanguage: {
                value: async function(lang) {
                    this.client.dispatcher.setGuildLanguage(this.id, lang);
                    this.client.emit('guildLanguageChange', this, lang);
                }
            }
        });
    }

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