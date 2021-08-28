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

        guildLanguage;
	}
}

module.exports = SubCommandGroupArgumentType;
