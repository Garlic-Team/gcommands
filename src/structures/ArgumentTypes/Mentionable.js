const ArgumentType = require('./Base');

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

	validate(argument, message, language) {
		const matches = message.content.match(/([0-9]+)/);
		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'mention');

		const role = message.guild.roles.cache.get(matches[1]);
		const user = this.client.users.cache.get(matches[1]);
		if ((!user) && (!role)) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'mention');
	}
    get(argument, message) {
        return message.match(/([0-9]+)/)[0];
    }
}

module.exports = MentionableArgumentType;
