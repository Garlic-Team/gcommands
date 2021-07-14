const ArgumentType = require('./base');

/**
 * The IntegerArgumentType class
 * @extends ArgumentType
 */
class IntegerArgumentType extends ArgumentType {
    /**
     * The IntegerArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'integer')

        /**
         * client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const guildLanguage = await message.guild.getLanguage();

		if(!parseInt(message.content)) return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'integer')

		if(argument.oneOf && !argument.oneOf.includes(message.content.toLowerCase())) return `Please enter one of the following options: ${argument.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
	}
}

module.exports = IntegerArgumentType;