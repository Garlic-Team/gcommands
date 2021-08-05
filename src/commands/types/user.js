const ArgumentType = require('./base');

/**
 * The UserArgumentType class
 * @param {Client}
 */
class UserArgumentType extends ArgumentType {
    /**
     * The UserArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'user');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const matches = message.content.match(/([0-9]+)/);
		const guildLanguage = await message.guild.getLanguage();

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'user');

		let user = this.client.users.cache.get(matches[1]);
		if (!user) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'user');
	}
}

module.exports = UserArgumentType;
