const { Structures } = require("discord.js")

module.exports = Structures.extend('Guild', Guild => {
    /**
     * The GuildStructure structure
     * @class
    */

    class GCommandsGuild extends Guild {
        constructor(...args) {
            super(...args)
        }

        /**
         * Method to getCommandPrefix
         * @returns {Promise}
        */
        async getCommandPrefix() {
			return this.client.dispatcher.getGuildPrefix(this.id);
        }

        /**
         * Method to setCommandPrefix
         * @returns {Boolean}
        */
		async setCommandPrefix(prefix) {
			this.client.dispatcher.setGuildPrefix(prefix, this.id);
			this.client.emit('commandPrefixChange', this, this._commandPrefix);
		}
    }

    return GCommandsGuild;
})