const ArgumentType = require('./base');

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

	async validate(argument, message) {
		const matches = message.content.match(/([0-9]+)/);
		const guildLanguage = await message.guild.getLanguage();

		if (!matches) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'role');

		let role = message.guild.roles.cache.get(matches[1]);
		if (!role) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'role');
	}
}

module.exports = RoleArgumentType;
