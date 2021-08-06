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
        super(client, 'integer');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const guildLanguage = await message.guild.getLanguage();

		if (!parseInt(message.content) || (parseInt(message.content) % 1 !== 0)) { return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'integer'); }

		if (argument.choices && !argument.choices.some(ch => ch.value === message.content.toLowerCase())) { return this.client.languageFile.ARGS_CHOICES[guildLanguage].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
}

module.exports = IntegerArgumentType;
