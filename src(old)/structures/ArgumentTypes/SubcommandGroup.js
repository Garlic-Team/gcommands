const ArgumentType = require('./Base');

/**
 * The SubCommandGroupArgumentType class
 * @param {Client}
 */
class SubCommandGroupArgumentType extends ArgumentType {
    /**
     * The SubCommandGroupArgumentType class
     */
    constructor(client) {
        super(client, 'SUB_COMMAND_GROUP');

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
        const subcommand = argument.subcommands?.find(sc => sc.name === message.content);
        if (argument.subcommands && !subcommand) return this.client.languageFile.ARGS_COMMAND[language].replace('{choices}', argument.subcommands.map(sc => `\`${sc.name}\``).join(', '));
        else this.value.value = subcommand;
    }
}

module.exports = SubCommandGroupArgumentType;
