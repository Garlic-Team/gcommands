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
        super(client, 'STRING');

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
        const choice = argument.choices?.find(ch => ch.name.toLowerCase() === message.content);
        if (argument.choices && !choice) return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', '));
        else if (choice) this.value.value = choice.value;
        else this.value.value = message.content;
    }
}

module.exports = StringArgumentType;
