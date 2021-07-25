const { Guild } = require('discord.js');

/**
 * The GGuild class
 * @extends Guild
 */
 class GGuild {
    constructor() {
        Object.defineProperties(Guild.prototype, {

            /**
             * Method to getCommandPrefix
             * @param {Boolean} cache
             * @returns {Promise}
            */
            getCommandPrefix: {
                value: async function(cache = true) {
                    return this.client.dispatcher.getGuildPrefix(this.id, cache)
                }
            },

            /**
             * Method to setCommandPrefix
             * @param {string} prefix
             * @returns {void}
            */
            setCommandPrefix: {
                value: async function(prefix)  {
                    this.client.dispatcher.setGuildPrefix(this.id, prefix);
                    this.client.emit('commandPrefixChange', this, prefix);
                }
            },

            /**
             * Method to getLanguage
             * @param {Boolean} cache
             * @returns {Promise}
            */
            getLanguage: {
                value: async function(cache = true) { return this.client.dispatcher.getGuildLanguage(this.id, cache) }
            },

            /**
             * Method to setLanguage
             * @param {string} lang
             * @returns {void}
            */
            setLanguage: {
                value: async function(lang) {
                    this.client.dispatcher.setGuildLanguage(this.id, lang);
                    this.client.emit('guildLanguageChange', this, lang);
                }
            }
        });
    }
}

module.exports = GGuild;