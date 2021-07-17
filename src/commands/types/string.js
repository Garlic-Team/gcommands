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
        super(client, 'string')
    }

	validate(argument, message) {
		if(argument.choices && !argument.choices.some(ch => ch.value == message.content.toLowerCase())) {
			return `Please enter one of the following options: ${argument.choices.map(opt => `\`${opt.name}\``).join(', ')}`;
		}
	}
}

module.exports = StringArgumentType;