const StringArgumentType = require('./types/string');
const IntegerArgumentType = require('./types/integer');
const BooleanArgumentType = require('./types/boolean');
const ChannelArgumentType = require('./types/channel');
const UserArgumentType = require('./types/user');
const RoleArgumentType = require('./types/role');
const NumberArgumentType = require('./types/number');
const MentionableArgumentType = require('./types/mentionable');

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
         * Client
         * @type {Client}
        */
        this.client = client;

        /**
         * Name
         * @type {string}
        */
        this.name = argument.name;

        /**
         * Argument
         * @type {Argument}
        */
        this.argument = this.determineArgument(client, argument);

        /**
         * Type
         * @type {string}
        */
        this.type = this.determineArgument(client, argument).type;

        /**
         * Prompt
         * @type {string}
        */
        this.prompt = argument.prompt || `Please define argument ${argument.name}`;

        /**
         * Choices
         * @type {Object}
        */
        this.choices = argument.choices;

        return this;
    }

    /**
     * Method to obtain
     * @param {Message|Object}
     * @param {String}
     */
    async obtain(message, prompt = this.prompt) {
        if (message.author.bot) return;

		const wait = 30000;

        message.reply(prompt);
        const responses = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
            max: 1,
            time: wait
        });
        if (responses.size === 0) {
 return {
            valid: true,
            timeLimit: true
        };
}

        let valid = await this.argument.validate(this, responses.first());
        if (valid) {
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
        if (argument.type === 3) return new StringArgumentType(client, argument);
        if (argument.type === 4) return new IntegerArgumentType(client, argument);
        if (argument.type === 5) return new BooleanArgumentType(client, argument);
        if (argument.type === 6) return new UserArgumentType(client, argument);
        if (argument.type === 7) return new ChannelArgumentType(client, argument);
        if (argument.type === 8) return new RoleArgumentType(client, argument);
        if (argument.type === 9) return new MentionableArgumentType(client, argument);
        if (argument.type === 10) return new NumberArgumentType(client, argument);
        else return { type: 'invalid' };
    }
}

module.exports = Argument;
