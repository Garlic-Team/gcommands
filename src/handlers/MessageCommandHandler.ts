import { Client, Collection, CommandInteractionOptionResolver, Guild, Message, MessageAttachment, SelectMenuInteraction, TextChannel, User } from 'discord.js';
import type { GClient } from '../lib/GClient';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { CommandType } from '../lib/structures/Command';
import { Commands } from '../lib/managers/CommandManager';
import { Handlers } from '../lib/managers/HandlerManager';
import { Logger, Events } from '../lib/util/logger/Logger';
import { Argument, ArgumentType } from '../lib/structures/Argument';
import { MessageArgumentTypeBase, MessageArgumentTypes } from '../lib/structures/arguments/base';
import { Util } from '../lib/util/Util';
import { AttachmentType } from '../lib/structures/arguments/Attachment';

const cooldowns = new Collection<string, Collection<string, number>>();

const checkValidation = async(arg: MessageArgumentTypes, content: string | MessageAttachment, client: Client, guild: Guild, argument: Argument, channel: TextChannel, user: User) => {
	if (!content) {
		const text = `${user.toString()}, please define argument \`${argument.name}\`, type: ${Util.toPascalCase(ArgumentType[argument.type.toString()])}`;
		if (argument.type === ArgumentType.STRING && argument.choices?.length !== 0) {
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
								options: argument.choices.map(
									ch => ({
										label: ch.name,
										value: ch.value
									})
								)
							}
						]
					}
				]
			});

			const component: SelectMenuInteraction = await channel.awaitMessageComponent({ filter: (m) => m.componentType === 'SELECT_MENU' && m.user.id === user.id && m.channelId === channel.id && m.message.id === message.id && m.customId === 'argument_choices', time: 60000 }) as SelectMenuInteraction;
	
			component.deferUpdate();
			content = component.values?.[0];
		} else {
			channel.send(text);
			const message = await channel.awaitMessages({ filter: (m) => m.author.id === user.id && m.channelId === channel.id, time: 60000, max: 1 });
	
			/**
			 * TODO: Use ArgumentType.ATTACHMENT | Need wait for https://github.com/Garlic-Team/gcommands/pull/314 to be merged (:
			 * @ts-expect-error */
			if (argument.type == 11) {
				const attachments = [...message.values()]?.[0]?.attachments;
				content = attachments ? [...attachments.values()][0] : null;
			}
			else content = [...message.values()]?.[0]?.content;
		}
	}

	const validate = arg instanceof AttachmentType ? arg.validate(content) : arg.validate(content as string);
	if (!validate) return checkValidation(arg, null, client, guild, argument, channel, user);

	return arg.resolve(argument);
};

export async function MessageCommandHandler(
	message: Message,
	commandName: string,
	args: Array<string> | Array<object>,
) {
	const client = message.client as GClient;

	const command = Commands.get(commandName);
	if (!command && client.options?.unknownCommandMessage)
		return message.reply({
			content: (await Util.getResponse('NOT_FOUND', { client })),
		});

	if (!command.type.includes(CommandType.MESSAGE)) return;

	if (command.cooldown) {
		const cooldown = Handlers.cooldownHandler(message.author.id, command, cooldowns);
		if (cooldown)
			return message.reply({
				content: (await Util.getResponse('COOLDOWN', { client })).replace('{time}', String(cooldown)).replace(
					'{name}',
					command.name + ' command',
				),
			});
	}

	for (const argument in command.arguments) {
		const arg = await MessageArgumentTypeBase.createArgument(command.arguments[argument].type, message.guild);

		args[argument] = await checkValidation(arg, args[argument] as string, client, message.guild, command.arguments[argument], message.channel as TextChannel, message.author);
	}

	let replied: Message;
	const ctx = new CommandContext(client, {
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
		arguments: new CommandInteractionOptionResolver(client, args, {}),
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
		reply: message.reply.bind(message),
	});

	if (!(await command.inhibit(ctx))) return;
	await Promise.resolve(command.run(ctx))
		.catch(async (error) => {
			Logger.emit(Events.HANDLER_ERROR, ctx, error);
			Logger.emit(Events.COMMAND_HANDLER_ERROR, ctx, error);
			Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);

			const errorReply = async() =>
				ctx.safeReply({
					content: (await Util.getResponse('ERROR', { client })),
					components: [],
				});
			
			if (typeof command.onError === 'function')
				await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
			else await errorReply();
		})
		.then(() => {
			Logger.emit(Events.HANDLER_RUN, ctx);
			Logger.emit(Events.COMMAND_HANDLER_RUN, ctx);
			Logger.debug(`Successfully ran command (${command.name}) for ${message.author.username}`);
		});
}