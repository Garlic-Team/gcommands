const ArgumentType = require('./Base');

/**
 * The RoleArgumentType class
 * @param {Client}
 */
class RoleArgumentType extends ArgumentType {
    /**
     * The RoleArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'role');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	validate(argument, message, language) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');

		const role = message.guild.roles.cache.get(matches[1]);
		if (!role) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');
	}
    get(argument, message) {
        return message.match(/([0-9]+)/)[0];
    }
}

module.exports = RoleArgumentType;
