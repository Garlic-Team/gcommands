const SubCommandArgumentType = require('./types/sub_command');
const SubCommandGroupArgumentType = require('./types/sub_command_group');
const StringArgumentType = require('./types/string');
const IntegerArgumentType = require('./types/integer');
const BooleanArgumentType = require('./types/boolean');
const ChannelArgumentType = require('./types/channel');
const UserArgumentType = require('./types/user');
const RoleArgumentType = require('./types/role');
const NumberArgumentType = require('./types/number');
const MentionableArgumentType = require('./types/mentionable');
const ifDjsV13 = require('../util/util').checkDjsVersion(13);

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
         * Required
         * @type {boolean}
        */
        this.required = argument.required;

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

        /**
         * SubCommands
         * @type {Array<Object>}
        */
         this.subcommands = argument.subcommands;

        return this;
    }

    /**
     * Method to obtain
     * @param {Message|Object}
     * @param {string}
     */
    async obtain(message, prompt = this.prompt) {
        if (message.author.bot) return;

        const guildLanguage = await message.guild.getLanguage();
		const wait = 30000;

        if (!this.required) prompt += `\n${this.client.languageFile.ARGS_OPTIONAL[guildLanguage]}`;
        if (this.type === 'sub_command' && this.subcommands) prompt = this.client.languageFile.ARGS_COMMAND[guildLanguage].replace('{choices}', this.subcommands.map(sc => `\`${sc.name}\``).join(', ')); ;
        message.reply(prompt);

        const filter = msg => msg.author.id === message.author.id;
        const responses = await (ifDjsV13 ? message.channel.awaitMessages({ filter, max: 1, time: wait }) : message.channel.awaitMessages(filter, { max: 1, time: wait }));
        if (responses.size === 0) {
            return {
                        valid: true,
                        timeLimit: true,
            };
        }

        let resFirst = responses.first();

        let invalid;
        if (!this.required && resFirst.content === 'skip') invalid = false;
        else invalid = await this.argument.validate(this, resFirst);

        if (invalid) {
            return {
                valid: false,
                prompt: invalid,
            };
        }

        let content = resFirst.content;
        if (this.choices) {
            const choice = this.choices.find(ch => ch.name === resFirst.content.toLowerCase());
            if (choice) content = choice.value;
        }
        if (this.subcommands) {
            const subcommand = this.subcommands.find(sc => sc.name === resFirst.content.toLowerCase());
            if (subcommand) content = subcommand;
        }

        return {
            valid: true,
            content: content,
        };
    }

    /**
     * Method to determineArgument
     * @param {Client}
     * @param {Argument}
     */
    determineArgument(client, argument) {
        if (argument.type === 1) return new SubCommandArgumentType(client, argument);
        if (argument.type === 2) return new SubCommandGroupArgumentType(client, argument);
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
