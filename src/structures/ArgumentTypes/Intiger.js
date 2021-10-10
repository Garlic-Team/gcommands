const ArgumentType = require('./Base');

/**
 * The IntegerArgumentType class
 * @extends ArgumentType
 */
class IntegerArgumentType extends ArgumentType {
    /**
     * The IntegerArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'integer');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	validate(argument, message, language) {
		if (!parseInt(message.content) || (parseInt(message.content) % 1 !== 0)) { return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'integer'); }

		if (argument.choices && !argument.choices.some(ch => ch.name === message.content)) { return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
    get(argument, message) {
        return parseInt(message);
    }
}

module.exports = IntegerArgumentType;
