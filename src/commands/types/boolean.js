const ArgumentType = require('./base');

/**
 * The BooleanArgumentType class
 * @extends ArgumentType
 */
class BooleanArgumentType extends ArgumentType {
    /**
     * The BooleanArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'boolean');

        /**
         * Client
         * @type {Client}
        */
		this.client = client;

        /**
         * TrueAnswerSet
         * @type {Set}
        */
        this.trueAnswerSet = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled']);

        /**
         * FalseAnswerSet
         * @type {Set}
        */
		this.falseAnswerSet = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled']);
    }

	async validate(argument, message) {
		const b = message.content.toLowerCase();
		const guildLanguage = await message.guild.getLanguage();

        console.log(this.trueAnswerSet.has(b));
        console.log(this.falseAnswerSet.has(b));


		if (this.trueAnswerSet.has(b) === false && this.falseAnswerSet.has(b) === false) {
			return this.client.languageFile.ARGS_MUST_CONTAIN[guildLanguage].replace('{argument}', argument.name).replace('{type}', 'boolean');
		}
	}

    get(argument, message) {
        if (this.falseAnswerSet.has(message)) return false;
        else if (this.trueAnswerSet.has(message)) return true;
    }
}

module.exports = BooleanArgumentType;
