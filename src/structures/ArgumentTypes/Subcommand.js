const ArgumentType = require('./Base');

/**
 * The SubCommandArgumentType class
 * @param {Client}
 */
class SubCommandArgumentType extends ArgumentType {
    /**
     * The SubCommandArgumentType class
     */
    constructor(client) {
        super(client, 'sub_command');

        /**
         * Client
         * @type {Client}
        */
        this.client = client;
    }

    validate(argument, message, language) {
        if (argument.subcommands && !argument.subcommands.find(sc => sc.name === message.content)) { return this.client.languageFile.ARGS_COMMAND[language].replace('{choices}', argument.subcommands.map(sc => `\`${sc.name}\``).join(', ')); }
    }
    get(argument, message) {
        return argument.subcommands.find(sc => sc.name === message);
    }
}

module.exports = SubCommandArgumentType;
