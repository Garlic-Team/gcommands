const SubCommandArgumentType = require('./ArgumentTypes/Subcommand');
const SubCommandGroupArgumentType = require('./ArgumentTypes/SubcommandGroup');
const StringArgumentType = require('./ArgumentTypes/String');
const IntegerArgumentType = require('./ArgumentTypes/Integer');
const BooleanArgumentType = require('./ArgumentTypes/Boolean');
const ChannelArgumentType = require('./ArgumentTypes/Channel');
const UserArgumentType = require('./ArgumentTypes/User');
const RoleArgumentType = require('./ArgumentTypes/Role');
const NumberArgumentType = require('./ArgumentTypes/Number');
const MentionableArgumentType = require('./ArgumentTypes/Mentionable');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

/**
 * The argument for message commands
 * @private
 */
class Argument {
    /**
     * @param {Client} client
     * @param {Object} argument
     * @param {boolean} isNotDm
     * @constructor
     */
    constructor(client, argument, isNotDm, language) {
        /**
         * The client
         * @type {Client}
        */
        this.client = client;

        /**
         * The name
         * @type {string}
        */
        this.name = argument.name;

        /**
         * If the command was executed inside DM's
         * @type {boolean}
        */
        this.isNotDm = isNotDm;

        /**
         * The argument type class
         * @type {Argument}
        */
        this.argument = this.determineArgument(client, argument);

        /**
         * The type
         * @type {string}
        */
        this.type = this.determineArgument(client, argument).type;

        /**
         * Wheter the argument is required or not
         * @type {boolean}
        */
        this.required = ['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(this.type) ? true : argument.required;

        /**
         * The prompt
         * @type {string}
        */
        this.prompt = argument.prompt || this.client.languageFile.ARGS_PROMPT[language].replace('{argument}', this.name);

        /**
         * The choices
         * @type {Object}
        */
        this.choices = argument.choices;

        /**
         * The channel types
         * @type {ArgumentChannelTypes}
         */
        this.channel_types = argument.channel_types || [];

        /**
         * The sub commands
         * @type {Array<Object>}
        */
        this.subcommands = argument.subcommands;
    }

    /**
     * Method to obtain
     * @param {Message|Object}
     * @param {string}
     * @returns {any}
     */
    async obtain(message, language, prompt = this.prompt) {
        if (message.author.bot) return;
        if (this.type === 'invalid') return false;

        const wait = this.client.wait;

        const getComponents = disabled => {
            const components = [
                new MessageActionRow()
                    .addComponents([
                        new MessageButton()
                            .setLabel('Cancel')
                            .setStyle('DANGER')
                            .setCustomId(`argument_cancel_${message.id}_${this.name}`)
                            .setDisabled(disabled),
                        !this.required ? new MessageButton()
                            .setLabel('Skip')
                            .setStyle('PRIMARY')
                            .setCustomId(`argument_skip_${message.id}_${this.name}`)
                            .setDisabled(disabled)
                            : [],
                    ]),
            ];
            if (this.type === 'boolean') {
                components[1] = new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel('True')
                        .setStyle('SUCCESS')
                        .setCustomId(`argument_true_${message.id}_${this.name}`)
                        .setDisabled(disabled),
                    new MessageButton()
                        .setLabel('False')
                        .setStyle('DANGER')
                        .setCustomId(`argument_false_${message.id}_${this.name}`)
                        .setDisabled(disabled),
                ]);
            }
            if (this.choices && Array.isArray(this.choices) && this.choices[0]) {
                const menu = new MessageSelectMenu()
                    .setPlaceholder('Select a choice')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setCustomId(`argument_choice_${message.id}_${this.name}`)
                    .setDisabled(disabled);

                for (const choice of this.choices) {
                    menu.addOptions([{ label: choice.name, value: choice.value }]);
                }

                components[1] = new MessageActionRow().addComponents([
                    menu,
                ]);
            }
            if (this.subcommands && Array.isArray(this.subcommands) && this.subcommands[0]) {
                const menu = new MessageSelectMenu()
                    .setPlaceholder('Select a subcommand')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setCustomId(`argument_subcommand_${message.id}_${this.name}`)
                    .setDisabled(disabled);

                for (const subcommand of this.subcommands) {
                    menu.addOptions([{ label: subcommand.name, value: subcommand.name }]);
                }

                components[1] = new MessageActionRow().addComponents([
                    menu,
                ]);
            }

            return components.reverse();
        };

        if (!this.required) prompt += `\n${this.client.languageFile.ARGS_OPTIONAL[language]}`;
        if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(this.type) && this.subcommands) prompt = this.client.languageFile.ARGS_COMMAND[language].replace('{choices}', this.subcommands.map(sc => `\`${sc.name}\``).join(', '));

        const msgReply = await message.reply({
            content: prompt,
            components: getComponents(false),
        });

        const messageCollectorfilter = msg => msg.author.id === message.author.id;
        const componentsCollectorfilter = i => i.user.id === message.author.id && i.message && i.message.id === msgReply.id && i.customId.includes(message.id) && i.customId.includes(this.name);

        const collectors = [
            message.channel.awaitMessages({ filter: messageCollectorfilter, max: 1, time: wait, errors: ['TIME'] }),
            message.channel.awaitMessageComponent({ filter: componentsCollectorfilter, componentType: 'BUTTON', time: (wait + 1) }),
            message.channel.awaitMessageComponent({ filter: componentsCollectorfilter, componentType: 'SELECT_MENU', time: (wait + 1) }),
        ];

        const responses = await Promise.race(collectors).catch();
        if (responses.size === 0) {
            return 'timelimit';
        }
        const resFirst = typeof responses.first === 'function' ? responses.first() : responses;

        if (resFirst.customId) {
            resFirst.deferUpdate().catch();
            if (resFirst.isSelectMenu()) {
                resFirst.content = resFirst.values[0];
            } else { resFirst.content = resFirst.customId.split('_')[1]; }
        }

        if (this.client.deletePrompt) await msgReply.delete();
        else await msgReply.edit({ content: msgReply.content, components: getComponents(true) });

        if (this.client.deleteInput && this.isNotDm && !resFirst.customId && message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await resFirst.delete();

        if (!this.required && resFirst.content === 'skip') return 'skip';
        else if (resFirst.content === 'cancel') return 'cancel';

        const invalid = await this.argument.validate(this, { content: resFirst.content.toLowerCase(), guild: resFirst.guild }, language);

        if (invalid) {
            return this.obtain(message, language, invalid);
        }

        return this.argument.get(resFirst);
    }

    /**
     * Method to determineArgument
     * @param {Client}
     * @param {Argument}
     * @returns {Object}
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
}

module.exports = Argument;
