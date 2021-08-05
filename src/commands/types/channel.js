const ArgumentType = require('./base');

/**
 * The ChannelArgumentType class
 * @extends ArgumentType
 */
class ChannelArgumentType extends ArgumentType {
    /**
     * The ChannelArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'channel');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const matches = message.content.match(/([0-9]+)/);
		const guildLanguage = await message.guild.getLanguage();

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'channel');

		let channel = this.client.channels.cache.get(matches[1]);
		if (!channel) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'channel');
	}
}

module.exports = ChannelArgumentType;
