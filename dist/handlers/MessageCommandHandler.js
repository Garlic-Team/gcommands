"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCommandHandler = void 0;
const discord_js_1 = require("discord.js");
const CommandContext_1 = require("../lib/structures/contexts/CommandContext");
const Command_1 = require("../lib/structures/Command");
const CommandManager_1 = require("../lib/managers/CommandManager");
const HandlerManager_1 = require("../lib/managers/HandlerManager");
const Logger_1 = require("../lib/util/logger/Logger");
const Argument_1 = require("../lib/structures/Argument");
const base_1 = require("../lib/structures/arguments/base");
const Util_1 = require("../lib/util/Util");
const Attachment_1 = require("../lib/structures/arguments/Attachment");
const Container_1 = require("../lib/structures/Container");
const cooldowns = new discord_js_1.Collection();
const checkValidation = async (arg, content, client, guild, argument, channel, user) => {
    if (!content) {
        const text = (await Util_1.Util.getResponse('ARGUMENT_REQUIRED', { client }))
            .replace('{user}', user.toString())
            .replace('{name}', argument.name)
            .replace('{type}', Util_1.Util.toPascalCase(Argument_1.ArgumentType[argument.type.toString()]));
        if (argument.type === Argument_1.ArgumentType.STRING && argument.choices && argument.choices.length !== 0) {
            const message = await channel.send({
                content: text,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                customId: 'argument_choices',
                                minValues: 0,
                                maxValues: 1,
                                disabled: false,
                                options: argument.choices.map((ch) => ({
                                    label: ch.name,
                                    value: ch.value,
                                })),
                            },
                        ],
                    },
                ],
            });
            const component = (await channel.awaitMessageComponent({
                filter: (m) => m.componentType === 'SELECT_MENU' &&
                    m.user.id === user.id &&
                    m.channelId === channel.id &&
                    m.message.id === message.id &&
                    m.customId === 'argument_choices',
                time: 60000,
            }));
            if (component.customId === null) {
                channel.send((await Util_1.Util.getResponse('ARGUMENT_TIME', { client })).replace('{user}', user.toString()));
                return null;
            }
            component.deferUpdate();
            content = component.values?.[0];
        }
        else {
            channel.send(text);
            const message = await channel.awaitMessages({
                filter: (m) => m.author.id === user.id && m.channelId === channel.id,
                time: 60000,
                max: 1,
            });
            if (message.size === 0) {
                channel.send((await Util_1.Util.getResponse('ARGUMENT_TIME', { client })).replace('{user}', user.toString()));
                return null;
            }
            if (argument.type == Argument_1.ArgumentType.ATTACHMENT) {
                const attachments = [...message.values()]?.[0]?.attachments;
                content = attachments ? [...attachments.values()][0] : null;
            }
            else
                content = [...message.values()]?.[0]?.content;
        }
    }
    const validate = arg instanceof Attachment_1.AttachmentType ? arg.validate(content) : arg.validate(content);
    if (!validate)
        return checkValidation(arg, null, client, guild, argument, channel, user);
    return arg.resolve(argument);
};
async function MessageCommandHandler(message, commandName, args) {
    const { client } = Container_1.container;
    const command = CommandManager_1.Commands.get(commandName);
    if (!command) {
        if (client.options.unknownCommandMessage)
            message.reply({
                content: await Util_1.Util.getResponse('NOT_FOUND', { client }),
            });
        return;
    }
    if (!command.type.includes(Command_1.CommandType.MESSAGE))
        return;
    if (command.cooldown) {
        const cooldown = HandlerManager_1.Handlers.cooldownHandler(message.author.id, command, cooldowns);
        if (cooldown)
            return message.reply({
                content: (await Util_1.Util.getResponse('COOLDOWN', { client }))
                    .replace('{time}', String(cooldown))
                    .replace('{name}', command.name + ' command'),
            });
    }
    for (const argument in command.arguments) {
        if ([Argument_1.ArgumentType.SUB_COMMAND, Argument_1.ArgumentType.SUB_COMMAND_GROUP].includes(command.arguments[argument].type))
            continue;
        const arg = await base_1.MessageArgumentTypeBase.createArgument(command.arguments[argument].type, message.guild);
        const check = await checkValidation(arg, args[argument], client, message.guild, command.arguments[argument], message.channel, message.author);
        if (check === null)
            return;
        args[argument] = check;
    }
    let replied;
    const ctx = new CommandContext_1.CommandContext(client, {
        message: message,
        channel: message.channel,
        createdAt: message.createdAt,
        createdTimestamp: message.createdTimestamp,
        guild: message.guild,
        guildId: message.guildId,
        user: message.author,
        member: message.member,
        memberPermissions: message.member.permissions,
        command: command,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        arguments: new discord_js_1.CommandInteractionOptionResolver(client, args, {}),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error This will not be fixed (typings for interaction are more important)
        deferReply: () => {
            return;
        },
        deleteReply: async () => {
            await replied.delete();
        },
        editReply: async (opt) => {
            return await replied.edit(opt);
        },
        fetchReply: async () => {
            return replied;
        },
        followUp: message.reply.bind(message),
        // @ts-expect-error This will not be fixed (typings for interaction are more important)
        reply: async (options) => {
            const msg = await message.reply(options);
            replied = msg;
            return msg;
        },
    });
    if (!(await command.inhibit(ctx)))
        return;
    await Promise.resolve(command.run(ctx))
        .catch(async (error) => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_ERROR, ctx, error);
        Logger_1.Logger.emit(Logger_1.Events.COMMAND_HANDLER_ERROR, ctx, error);
        Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
        if (error.stack)
            Logger_1.Logger.trace(error.stack);
        const errorReply = async () => ctx.safeReply({
            content: await Util_1.Util.getResponse('ERROR', { client }),
            components: [],
        });
        if (typeof command.onError === 'function')
            await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
        else
            await errorReply();
    })
        .then(() => {
        Logger_1.Logger.emit(Logger_1.Events.HANDLER_RUN, ctx);
        Logger_1.Logger.emit(Logger_1.Events.COMMAND_HANDLER_RUN, ctx);
        Logger_1.Logger.debug(`Successfully ran command (${command.name}) for ${message.author.username}`);
    });
}
exports.MessageCommandHandler = MessageCommandHandler;
