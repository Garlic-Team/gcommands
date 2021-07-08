const { Guild } = require("discord.js");

module.exports = Object.defineProperties(Guild.prototype, {
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