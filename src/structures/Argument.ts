import { Message, MessageActionRow, MessageButton, MessageSelectMenu, Collection, ButtonInteraction, SelectMenuInteraction, BaseGuildTextChannel } from 'discord.js';
import { GCommandsClient } from '../base/GCommandsClient';
import { CommandArgsOption, CommandArgsOptionChoice } from '../typings/interfaces';
import { ArgumentType, LanguageType } from '../util/Constants';
import { BaseArgument, SubCommandArgument, SubCommandGroupArgument, StringArgument, IntegerArgument, BooleanArgument, UserArgument, ChannelArgument, RoleArgument, MentionableArgument, NumberArgument } from './ArgumentTypes/index';

interface Arg extends CommandArgsOption { subcommands?: Array<CommandArgsOption> }

export class Argument {
    private client: GCommandsClient;
    private isNotDm: boolean;
    public language: LanguageType;
    public argument: BaseArgument;
    public name: string;
    private type: string;
    private required: boolean;
    public choices: Array<CommandArgsOptionChoice>;
    public subcommands: Array<CommandArgsOption>;

    public constructor(client: GCommandsClient, argument: Arg, options: { isNotDm: boolean, language: LanguageType }) {
        this.client = client;
        this.isNotDm = options.isNotDm;
        this.language = options.language;

        this.argument = this.determineArgument(argument.type);
        this.name = argument.name;
        this.type = this.argument?.type;
        this.required = argument.required;
        this.choices = argument.choices;
        this.subcommands = argument.subcommands;
    }
    public async collect(message: Message, prompt?: string): Promise<unknown> {
        if (message.author.bot) return;
        if (!this.type) return false;

        const wait = this.client.options.arguments.wait;

        const getComponents = (disabled: boolean) => {
            const components = [
                new MessageActionRow().addComponents([
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
                            : undefined,
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

        if (!this.required) prompt += `\n${this.client.languageFile.ARGS_OPTIONAL[this.language]}`;
        if (['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(this.type) && this.subcommands) prompt = this.client.languageFile.ARGS_COMMAND[this.language].replace('{choices}', this.subcommands.map(sc => `\`${sc.name}\``).join(', '));

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

        let content;

        const responses = await Promise.race(collectors).catch();
        if (!responses || (responses instanceof Collection && responses.size === 0)) {
            return 'timelimit';
        }
        const resFirst = responses instanceof Collection ? responses.first() : responses;

        if (resFirst instanceof (ButtonInteraction || SelectMenuInteraction)) {
            resFirst.deferUpdate().catch();
            if (resFirst.isSelectMenu()) {
                content = resFirst.values[0];
            } else { content = resFirst.customId.split('_')[1]; }
        }

        if (this.client.options.arguments.deletePrompt) await msgReply.delete();
        else await msgReply.edit({ content: msgReply.content, components: getComponents(true) });

        if (this.client.options.arguments.deleteInput) {
            if (message.channel instanceof BaseGuildTextChannel) {
                if (resFirst instanceof Message) {
                    if (this.isNotDm && !(resFirst instanceof (ButtonInteraction || SelectMenuInteraction)) && message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await resFirst.delete();
                }
            }
        }

        if (!this.required && content === 'skip') return 'skip';
        else if (content === 'cancel') return 'cancel';

        const invalid = await this.argument.validate(this, { content: content.toLowerCase(), guild: resFirst.guild }, this.language);

        if (invalid) {
            return this.collect(message, invalid);
        }

        return this.argument.get();
    }
    public determineArgument(type: ArgumentType) {
        if (type === ArgumentType.SUB_COMMAND) return new SubCommandArgument(this.client);
        if (type === ArgumentType.SUB_COMMAND_GROUP) return new SubCommandGroupArgument(this.client);
        if (type === ArgumentType.STRING) return new StringArgument(this.client);
        if (type === ArgumentType.INTIGER) return new IntegerArgument(this.client);
        if (type === ArgumentType.BOOLEAN) return new BooleanArgument(this.client);
        if (this.isNotDm && type === ArgumentType.USER) return new UserArgument(this.client);
        if (this.isNotDm && type === ArgumentType.CHANNEL) return new ChannelArgument(this.client);
        if (this.isNotDm && type === ArgumentType.ROLE) return new RoleArgument(this.client);
        if (this.isNotDm && type === ArgumentType.MENTIONABLE) return new MentionableArgument(this.client);
        if (type === ArgumentType.NUMBER) return new NumberArgument(this.client);
        return undefined;
    }
}
