const ArgumentType = require('./Base');

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
        super(client, 'NUMBER');

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
        if (!parseInt(message.content)) { return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'number'); }

        const choice = argument.choices?.find(ch => ch.name === message.content);
        if (argument.choices && !choice) return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', '));
        else if (argument.choices) this.value.value = choice.value;
        else this.value.value = Number(message.content);
    }
}

module.exports = NumberArgumentType;
