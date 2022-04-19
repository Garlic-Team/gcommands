import {
	Client,
	Collection,
	CommandInteractionOptionResolver,
	Guild,
	InteractionReplyOptions,
	Message,
	MessageAttachment,
	MessagePayload,
	ReplyMessageOptions,
	SelectMenuInteraction,
	TextChannel,
	User,
} from 'discord.js';
import type { GClient } from '../lib/GClient';
import { Commands } from '../lib/managers/CommandManager';
import { Handlers } from '../lib/managers/HandlerManager';
import { Argument, ArgumentType } from '../lib/structures/Argument';
import { CommandType } from '../lib/structures/Command';
import { AttachmentType } from '../lib/structures/arguments/Attachment';
import {
	MessageArgumentTypeBase,
	MessageArgumentTypes,
} from '../lib/structures/arguments/base';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { Util } from '../lib/util/Util';
import { Logger, Events } from '../lib/util/logger/Logger';

const cooldowns = new Collection<string, Collection<string, number>>();

const checkValidation = async (
	arg: MessageArgumentTypes,
	content: string | MessageAttachment,
	client: Client,
	guild: Guild,
	argument: Argument,
	channel: TextChannel,
	user: User,
) => {
	if (!content) {
		const text = (await Util.getResponse('ARGUMENT_REQUIRED', { client }))
			.replace('{user}', user.toString())
			.replace('{name}', argument.name)
			.replace(
				'{type}',
				Util.toPascalCase(ArgumentType[argument.type.toString()]),
			);
		if (
			argument.type === ArgumentType.STRING &&
			argument.choices &&
			argument.choices.length !== 0
		) {
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
								options: argument.choices.map(ch => ({
									label: ch.name,
									value: ch.value,
								})),
							},
						],
					},
				],
			});

			const component: SelectMenuInteraction =
				(await channel.awaitMessageComponent({
					filter: m =>
						m.componentType === 'SELECT_MENU' &&
						m.user.id === user.id &&
						m.channelId === channel.id &&
						m.message.id === message.id &&
						m.customId === 'argument_choices',
					time: 60000,
				})) as SelectMenuInteraction;
			if (component.customId === null) {
				channel.send(
					(await Util.getResponse('ARGUMENT_TIME', { client })).replace(
						'{user}',
						user.toString(),
					),
				);
				return null;
			}

			component.deferUpdate();
			content = component.values?.[0];
		} else {
			channel.send(text);

			const message = await channel.awaitMessages({
				filter: m => m.author.id === user.id && m.channelId === channel.id,
				time: 60000,
				max: 1,
			});
			if (message.size === 0) {
				channel.send(
					(await Util.getResponse('ARGUMENT_TIME', { client })).replace(
						'{user}',
						user.toString(),
					),
				);
				return null;
			}

			if (argument.type == ArgumentType.ATTACHMENT) {
				const attachments = [
					...(message as Collection<string, Message<boolean>>).values(),
				]?.[0]?.attachments;
				content = attachments ? [...attachments.values()][0] : null;
			} else {
				content = [
					...(message as Collection<string, Message<boolean>>).values(),
				]?.[0]?.content;
			}
		}
	}

	const validate =
		arg instanceof AttachmentType
			? arg.validate(content)
			: arg.validate(content as string);
	if (!validate)
		return checkValidation(arg, null, client, guild, argument, channel, user);

	return arg.resolve(argument);
};

export async function MessageCommandHandler(
	message: Message,
	commandName: string,
	args: Array<string> | Array<object>,
) {
	const client = message.client as GClient;

	const command = Commands.get(commandName);
	if (!command) {
		return client.options?.unknownCommandMessage
			? message.reply({
					content: await Util.getResponse('NOT_FOUND', { client }),
			  })
			: null;
	}

	if (!command.type.includes(CommandType.MESSAGE)) return;

	if (command.cooldown) {
		const cooldown = Handlers.cooldownHandler(
			message.author.id,
			command,
			cooldowns,
		);
		if (cooldown) {
			return message.reply({
				content: (await Util.getResponse('COOLDOWN', { client }))
					/**
					 * @deprecated Use {duration} instead
					 */
					.replaceAll('{time}', String(cooldown))
					.replaceAll('{duration}', String(cooldown))
					.replaceAll('{name}', command.name),
			});
		}
	}

	for (const argument in command.arguments) {
		if (
			[ArgumentType.SUB_COMMAND, ArgumentType.SUB_COMMAND_GROUP].includes(
				command.arguments[argument].type as ArgumentType,
			)
		)
			continue;

		const arg = await MessageArgumentTypeBase.createArgument(
			command.arguments[argument].type,
			message.guild,
		);
		const check = await checkValidation(
			arg,
			args[argument] as string,
			client,
			message.guild,
			command.arguments[argument],
			message.channel as TextChannel,
			message.author,
		);

		if (check === null) return;

		args[argument] = check;
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
		memberPermissions: message.member?.permissions ?? null,
		command: command,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		arguments: new CommandInteractionOptionResolver(client, args, {}),
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error This will not be fixed (typings for interaction are more important)
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		deferReply: () => {},
		deleteReply: async () => {
			await replied.delete();
		},
		editReply: async opt => await replied.edit(opt),
		fetchReply: async () => replied,
		followUp: message.reply.bind(message),
		// @ts-expect-error This will not be fixed (typings for interaction are more important)
		reply: async (
			options:
				| string
				| MessagePayload
				| ReplyMessageOptions
				| InteractionReplyOptions,
		) => {
			const msg = await message.reply(options);
			replied = msg;
			return msg;
		},
	});

	if (!(await command.inhibit(ctx))) return;
	await Promise.resolve(command.run(ctx))
		.catch(async error => {
			Logger.emit(Events.HANDLER_ERROR, ctx, error);
			Logger.emit(Events.COMMAND_HANDLER_ERROR, ctx, error);
			Logger.error(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);

			const errorReply = async () =>
				ctx.safeReply({
					content: await Util.getResponse('ERROR', { client }),
					components: [],
				});

			if (typeof command.onError === 'function') {
				await Promise.resolve(command.onError(ctx, error)).catch(
					async () => await errorReply(),
				);
			} else {
				await errorReply();
			}
		})
		.then(() => {
			Logger.emit(Events.HANDLER_RUN, ctx);
			Logger.emit(Events.COMMAND_HANDLER_RUN, ctx);
			Logger.debug(
				`Successfully ran command (${command.name}) for ${message.author.username}`,
			);
		});
}
