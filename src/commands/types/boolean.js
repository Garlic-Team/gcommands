const ArgumentType = require('./base');

/**
 * The BooleanArgumentType class
 * @extends ArgumentType
 */
class BooleanArgumentType extends ArgumentType {
    /**
     * The BooleanArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'boolean');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;

        /**
         * AnswerSet
         * @type {Set}
        */
		this.answerSet = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled']);
    }

	async validate(argument, message) {
		const b = message.content.toLowerCase();
		const guildLanguage = await message.guild.getLanguage();

		if (!this.answerSet.has(b)) {
			return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'boolean');
		}
	}
}

module.exports = BooleanArgumentType;
