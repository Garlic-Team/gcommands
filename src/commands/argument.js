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
const MessageActionRow = require('../structures/MessageActionRow');
const MessageButton = require('../structures/MessageButton');
const ButtonInteraction = require('../structures/ButtonInteraction');
const { ArgumentChannelTypes } = require('../util/Constants');
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
    constructor(client, argument, isNotDm) {
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
         * Channel Types
         * @type {ArgumentChannelTypes}
         */
        this.channel_types = this.channelTypes;

        /**
         * SubCommands
         * @type {Array<Object>}
        */
        this.subcommands = argument.subcommands;


        /**
         * IsNotDm
         * @type {string}
        */
        this.isNotDm = isNotDm;
    }

    get channelTypes() {
        const types = this.argument.channel_types ? !Array.isArray(this.argument.channel_types) ? [this.argument.channel_types] : this.argument.channel_types : [];
        const final = [];

        for (const type of types) {
            final.push(ArgumentChannelTypes[type]);
        }

        return final;
    }

    /**
     * Method to obtain
     * @param {Message|Object}
     * @param {string}
     */
    async obtain(message, language, prompt = this.prompt) {
        if (message.author.bot) return;

        const wait = 30000;

        const getComponents = disabled => {
            const components = [
                new MessageActionRow()
                    .addComponents([
                        new MessageButton()
                            .setLabel('Cancel')
                            .setStyle('red')
                            .setCustomId(`argument_cancel_${message.id}`)
                            .setDisabled(disabled),
                        !this.required ? new MessageButton()
                            .setLabel('Skip')
                            .setStyle('blurple')
                            .setCustomId(`argument_skip_${message.id}`)
                            .setDisabled(disabled)
                            : [],
                    ]),
            ];
            if (this.type === 'boolean') {
                components[1] = new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel('True')
                        .setStyle('green')
                        .setCustomId(`argument_true_${message.id}`)
                        .setDisabled(disabled),
                    new MessageButton()
                        .setLabel('False')
                        .setStyle('red')
                        .setCustomId(`argument_false_${message.id}`)
                        .setDisabled(disabled),
                ]);
            }

            return components.reverse();
        };

        if (!this.required) prompt += `\n${this.client.languageFile.ARGS_OPTIONAL[language]}`;
        if ((this.type === 'sub_command' || 'sub_command_group') && this.subcommands) prompt = this.client.languageFile.ARGS_COMMAND[language].replace('{choices}', this.subcommands.map(sc => `\`${sc.name}\``).join(', '));

        const msgReply = await message.reply({
            content: prompt,
            components: getComponents(false),
        });

        const messageCollectorfilter = msg => msg.author.id === message.author.id;
        const componentsCollectorfilter = i => i.user.id === message.author.id && i.message && i.message.id === msgReply.id && i.isButton() && i.customId.includes('argument');

        // eslint-disable-next-line capitalized-comments
        // if (this.type === 'boolean') filter = i => i.user.id === message.author.id && i.message && i.message.id === msgReply.id && i.isButton() && i.customId.includes('booleanargument');

        const collectors = [
            (ifDjsV13 ? message.channel.awaitMessages({ filter: messageCollectorfilter, max: 1, time: wait }) : message.channel.awaitMessages(messageCollectorfilter, { max: 1, time: wait })),
            message.channel.awaitMessageComponents({ filter: componentsCollectorfilter, max: 1, time: wait }),
        ];

        const responses = await Promise.race(collectors);
        if (responses.size === 0) {
            return {
                valid: true,
                timeLimit: true,
            };
        }

        const resFirst = responses.first();

        if (resFirst instanceof ButtonInteraction) {
            await resFirst.defer();
            resFirst.content = resFirst.customId.split('_')[1];
        }

        if (this.client.deletePrompt) await msgReply.delete();
        else await msgReply.edit({ content: msgReply.content, components: getComponents(true) });

        if (this.client.deleteInput && this.isNotDm && resFirst instanceof ButtonInteraction === false && message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await resFirst.delete();

        let invalid;
        let reason;
        if (!this.required && resFirst.content === 'skip') {
            invalid = true;
            reason = 'skip';
        } else if (resFirst.content === 'cancel') {
            invalid = true;
            reason = 'cancel';
        } else { invalid = await this.argument.validate(this, { content: resFirst.content.toLowerCase(), guild: resFirst.guild }, language); }

        if (invalid) {
            return {
                valid: false,
                prompt: invalid,
                reason: reason,
            };
        }

        return {
            valid: true,
            content: this.get(resFirst),
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
        if (this.isNotDm && argument.type === 6) return new UserArgumentType(client, argument);
        if (this.isNotDm && argument.type === 7) return new ChannelArgumentType(client, argument);
        if (this.isNotDm && argument.type === 8) return new RoleArgumentType(client, argument);
        if (this.isNotDm && argument.type === 9) return new MentionableArgumentType(client, argument);
        if (argument.type === 10) return new NumberArgumentType(client, argument);
        else return { type: 'invalid' };
    }

    /**
     * Method to get
     * @param {object | string} message
     */
    get(message) {
        if (typeof message === 'string') return this.argument.get(this, message);
        else return this.argument.get(this, message.content);
    }
}

module.exports = Argument;
