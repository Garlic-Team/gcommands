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
        super(client, 'INTEGER');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;

         /**
         * Value
         * @type {Object}
        */
          this.value = {};
    }

	validate(argument, message, language) {
		if (!parseInt(message.content) || (parseInt(message.content) % 1 !== 0)) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'integer');

        const choice = argument.choices?.find(ch => ch.name === message.content);
		if (argument.choices && !choice) return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', '));
        else if (argument.choices) this.value.value = choice.value;
        else this.value.value = parseInt(message.content);
    }
}

module.exports = IntegerArgumentType;
