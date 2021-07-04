const { Structures, Guild } = require("discord.js")
const updater = require("../util/updater")

if(!updater.checkDjsVersion("13")) {
    module.exports = Structures.extend('Guild', Guild => {
        /**
         * The GuildStructure structure
         * @extends Guild
        */

        class GCommandsGuild extends Guild {
            constructor(...args) {
                super(...args)
            }

            /**
             * Method to getCommandPrefix
             * @returns {Promise}
            */
            async getCommandPrefix(cache = true) {
                return this.client.dispatcher.getGuildPrefix(this.id, cache);
            }

            /**
             * Method to setCommandPrefix
             * @returns {void}
            */
            async setCommandPrefix(prefix) {
                this.client.dispatcher.setGuildPrefix(this.id, prefix);
                this.client.emit('commandPrefixChange', this, this.prefix);
            }

            /**
             * Method to getLanguage
             * @returns {Promise}
            */
            async getLanguage(cache = true) {
                return this.client.dispatcher.getGuildLanguage(this.id, cache);
            }

            /**
             * Method to setLanguage
             * @returns {void}
            */
            async setLanguage(lang) {
                this.client.dispatcher.setGuildLanguage(this.id, lang);
                this.client.emit('guildLanguageChange', this, this.language);
            }
        }

        return GCommandsGuild;
    })
} else module.exports = Guild;