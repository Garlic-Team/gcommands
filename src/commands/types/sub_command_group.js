const ArgumentType = require('./base');

/**
 * The SubCommandGroupArgumentType class
 * @param {Client}
 */
class SubCommandGroupArgumentType extends ArgumentType {
    /**
     * The SubCommandGroupArgumentType class
     */
    constructor(client) {
        super(client, 'sub_command_group');

        /**
         * Client
         * @type {Client}
        */
        this.client = client;
    }

	async validate(argument, message) {
        const guildLanguage = await message.guild.getLanguage();

        if (argument.subcommands && !argument.subcommands.find(sc => sc.name === message.content.toLowerCase())) { return this.client.languageFile.ARGS_COMMAND[guildLanguage].replace('{choices}', argument.subcommands.map(sc => `\`${sc.name}\``).join(', ')); }
	}
    get(argument, message) {
        return argument.subcommands.find(sc => sc.name === message);
    }
}

module.exports = SubCommandGroupArgumentType;
