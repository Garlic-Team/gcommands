const { Structures } = require("discord.js")

module.exports = Structures.extend('Guild', Guild => {
    class GCommandsGuild extends Guild {
        constructor(...args) {
            super(...args)
        }

        async getCommandPrefix() {
			return this.client.dispatcher.getGuildPrefix(this.id);
        }

		async setCommandPrefix(prefix) {
			this.client.dispatcher.setGuildPrefix(prefix, this.id);
			this.client.emit('commandPrefixChange', this, this._commandPrefix);
		}
    }

    return GCommandsGuild;
})