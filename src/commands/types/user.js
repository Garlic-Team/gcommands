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

	validate(argument, message, language) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'user');

		const user = this.client.users.cache.get(matches[1]);
		if (!user) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'user');
	}
    get(argument, message) {
        return message.match(/([0-9]+)/)[0];
    }
}

module.exports = UserArgumentType;
