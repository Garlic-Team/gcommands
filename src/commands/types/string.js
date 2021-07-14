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
		if(argument.oneOf && !argument.oneOf.includes(message.content.toLowerCase())) {
			return `Please enter one of the following options: ${argument.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
	}
}

module.exports = StringArgumentType;