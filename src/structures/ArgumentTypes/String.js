const ArgumentType = require('./Base');

/**
 * The StringArgumentType class
 * @param {Client}
 */
class StringArgumentType extends ArgumentType {
    /**
     * The StringArgumentType class
     */
    constructor(client) {
        super(client, 'string');

        /**
         * Client
         * @type {Client}
        */
        this.client = client;
    }

	validate(argument, message, language) {
        if (argument.choices && !argument.choices.some(ch => ch.name.toLowerCase() === message.content)) { return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
    get(argument, message) {
        if (argument.choices) {
            return argument.choices.find(ch => ch.name.toLowerCase() === message);
        } else {
            return message;
        }
    }
}

module.exports = StringArgumentType;
