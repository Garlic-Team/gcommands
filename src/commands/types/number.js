const ArgumentType = require('./base');

/**
 * The NumberArgumentType class
 * @extends ArgumentType
 */
class NumberArgumentType extends ArgumentType {
    /**
     * The NumberArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'number');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	validate(argument, message, language) {
		if (!parseInt(message.content)) { return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'number'); }

		if (argument.choices && !argument.choices.some(ch => ch.name === message.content)) { return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
    get(argument, message) {
        return Number(message);
    }
}

module.exports = NumberArgumentType;
