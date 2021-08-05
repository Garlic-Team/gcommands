const ArgumentType = require('./base');

/**
 * The MentionableArgumentType class
 * @extends ArgumentType
 */
class MentionableArgumentType extends ArgumentType {
    /**
     * The MentionableArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'mentionable');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const matches = message.content.match(/([0-9]+)/);
		const guildLanguage = await message.guild.getLanguage();

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'mention');

		let role = message.guild.roles.cache.get(matches[1]);
		let user = this.client.users.cache.get(matches[1]);
		if ((!user) && (!role)) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'mention');
	}
}

module.exports = MentionableArgumentType;
