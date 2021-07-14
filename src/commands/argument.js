const ms = require("ms");
const StringArgumentType = require("./types/string");
const IntegerArgumentType = require("./types/integer");
const BooleanArgumentType = require("./types/boolean");
const ChannelArgumentType = require("./types/channel");
const UserArgumentType = require("./types/user");
const RoleArgumentType = require("./types/role");

/**
 * The Argument class
 */
class Argument {
    /**
     * The Argument class
     * @param {Client}
     * @param {Object} argument
     */
    constructor(client, argument) {
        /**
         * client
         * @type {Client}
        */
        this.client = client;

        /**
         * name
         * @type {String}
        */
        this.name = argument.name;

        /**
         * argument
         * @type {Argument}
        */
        this.argument = this.determineArgument(client, argument);

        /**
         * type
         * @type {String}
        */
        this.type = this.determineArgument(client, argument).type;

        /**
         * prompt
         * @type {String}
        */
        this.prompt = argument.prompt || `Please define argument ${argument.name}`;

        /**
         * prompt
         * @type {Array}
        */
        this.oneOf = argument.oneOf;

        return this;
    }

    /**
     * Method to obtain
     * @param {Message|Object}
     * @param {String}
     */
    async obtain(message, prompt = this.prompt) {
        if(message.author.bot) return;

		const wait = 30000;

        message.reply(prompt)
        const responses = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
            max: 1,
            time: wait
        });
        if(responses.size == 0) return {
            valid: true,
            timeLimit: true
        }

        let valid = await this.argument.validate(this, responses.first())
        if(valid) {
            return {
                valid: false,
                prompt: valid
            };
        }

        return {
            valid: true,
            content: responses.first().content
        };
    }

    /**
     * Method to determineArgument
     * @param {Client}
     * @param {Argument}
     */
    determineArgument(client, argument) {
        if(argument.type == 3) return new StringArgumentType(client, argument);
        if(argument.type == 4) return new IntegerArgumentType(client, argument);
        if(argument.type == 5) return new BooleanArgumentType(client, argument);
        if(argument.type == 6) return new UserArgumentType(client, argument);
        if(argument.type == 7) return new ChannelArgumentType(client, argument);
        if(argument.type == 8) return new RoleArgumentType(client, argument);
        else return new StringArgumentType(client, argument);
    }
}

module.exports = Argument;