const ArgumentType = require('./base');

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

	async validate(argument, message) {
        const guildLanguage = await message.guild.getLanguage();

        if (argument.subcommands && !argument.subcommands.find(sc => sc.name === message.content.toLowerCase())) { return this.client.languageFile.ARGS_CHOICES[guildLanguage].replace('{choices}', argument.subcommands.map(sc => `\`${sc.name}\``).join(', ')); }
	}
}

module.exports = SubCommandArgumentType;
