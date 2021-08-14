const ArgumentType = require('./base');

/**
 * The StringArgumentType class
 * @param {Client}
 */
class StringArgumentType extends ArgumentType {
    /**
     * The StringArgumentType class
     */
    constructor(client) {
        super(client, 'string');
    }

	async validate(argument, message) {
        const guildLanguage = await message.guild.getLanguage();

		if (argument.choices && !argument.choices.some(ch => ch.value === message.content.toLowerCase())) { return this.client.languageFile.ARGS_CHOICES[guildLanguage].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', ')); }
	}
}

module.exports = StringArgumentType;
