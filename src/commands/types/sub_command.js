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

        guildLanguage;
	}
}

module.exports = SubCommandArgumentType;
