const ArgumentType = require('./Base');

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
        super(client, 'BOOLEAN');

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

        /**
         * TrueAnswerSet
         * @type {Set}
        */
        this.trueAnswerSet = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled']);

        /**
         * FalseAnswerSet
         * @type {Set}
        */
        this.falseAnswerSet = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled']);
    }

    validate(argument, message, language) {
        if (this.trueAnswerSet.has(message.content) === false && this.falseAnswerSet.has(message.content) === false) {
            return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'boolean');
        } else if (this.falseAnswerSet.has(message.content)) {
            this.value.value = false;
        } else if (this.trueAnswerSet.has(message.content)) {
            this.value.value = true;
        }
    }
}

module.exports = BooleanArgumentType;
