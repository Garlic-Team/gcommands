const ArgumentType = require('./base');

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
        super(client, 'number');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;
    }

	async validate(argument, message) {
		const guildLanguage = await message.guild.getLanguage();

		if (!parseInt(message.content)) { return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'number'); }

		if (argument.choices && !argument.choices.some(ch => ch.value === message.content.toLowerCase())) { return this.client.languageFile.ARGS_CHOICES[guildLanguage].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
}

module.exports = NumberArgumentType;
