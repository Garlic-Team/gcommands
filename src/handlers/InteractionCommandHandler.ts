import { setTimeout } from 'node:timers';
import {
	Collection,
	CommandInteraction,
	ContextMenuCommandInteraction,
} from 'discord.js';
import { AutoDeferType, GClient } from '../lib/GClient';
import { Commands } from '../lib/managers/CommandManager';
import { Handlers } from '../lib/managers/HandlerManager';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { Util } from '../lib/util/Util';
import { Events, Logger } from '../lib/util/logger/Logger';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function InteractionCommandHandler(
	interaction: CommandInteraction | ContextMenuCommandInteraction,
) {
	const client = interaction.client as GClient;

	const command = Commands.get(interaction.commandName);
	if (!command) {
		return client.options?.unknownCommandMessage
			? interaction.reply({
					content: await Util.getResponse('NOT_FOUND', { client }),
			  })
			: null;
	}

	if (command.cooldown) {
		const cooldown = Handlers.cooldownHandler(
			interaction.user.id,
			command,
			cooldowns,
		);
		if (cooldown) {
			return interaction.reply({
				content: (await Util.getResponse('COOLDOWN', interaction))
					/**
					 * @deprecated Use {duration} instead
					 */
					.replaceAll('{time}', String(cooldown))
					.replaceAll('{duration}', String(cooldown))
					.replaceAll('{name}', command.name),
				ephemeral: true,
			});
		}
	}

	const ctx = new CommandContext(client, {
		interaction: interaction,
		channel: interaction.channel,
		createdAt: interaction.createdAt,
		createdTimestamp: interaction.createdTimestamp,
		guild: interaction.guild,
		guildId: interaction.guildId,
		user: interaction.user,
		member: interaction.member,
		memberPermissions: interaction.memberPermissions,
		command: command,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		arguments: interaction.options,
		deferReply: interaction.deferReply.bind(interaction),
		deleteReply: interaction.deleteReply.bind(interaction),
		editReply: interaction.editReply.bind(interaction),
		fetchReply: interaction.fetchReply.bind(interaction),
		followUp: interaction.followUp.bind(interaction),
		reply: interaction.reply.bind(interaction),
	});

	if (!(await command.inhibit(ctx))) return;

	let autoDeferTimeout;
	if (command.autoDefer) {
		autoDeferTimeout = setTimeout(() => {
			if (!interaction.deferred && !interaction.replied)
				ctx.deferReply({
					ephemeral: command.autoDefer === AutoDeferType.EPHEMERAL,
				});
		}, 2500 - client.ws.ping);
	}

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
					content: await Util.getResponse('ERROR', interaction),
					components: [],
					ephemeral: true,
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
			if (autoDeferTimeout) clearTimeout(autoDeferTimeout);

			Logger.emit(Events.HANDLER_RUN, ctx);
			Logger.emit(Events.COMMAND_HANDLER_RUN, ctx);
			Logger.debug(
				`Successfully ran command (${command.name}) for ${interaction.user.username}`,
			);
		});
}
