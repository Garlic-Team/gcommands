import {Collection, CommandInteraction, ContextMenuInteraction} from 'discord.js';
import {AutoDeferType, GClient} from '../lib/GClient';
import {CommandContext} from '../lib/structures/CommandContext';
import {Handlers} from '../lib/managers/HandlerManager';
import {Commands} from '../lib/managers/CommandManager';
import Logger from 'js-logger';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function InteractionCommandHandler(interaction: CommandInteraction | ContextMenuInteraction) {
	const client = interaction.client as GClient;

	const command = Commands.get(interaction.commandName);
	if (!command) return interaction.reply({
		content: client.responses.NOT_FOUND,
		ephemeral: true
	});

	if (command.cooldown) {
		const cooldown = Handlers.cooldownHandler(interaction.user.id, command, cooldowns);
		if (cooldown) return interaction.reply({
			content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', command.name + ' command'),
			ephemeral: true,
		});
	}

	const ctx = CommandContext.createWithInteraction(interaction, command);

	if (!await command.inhibit(ctx)) return;

	let autoDeferTimeout;
	if (command.autoDefer) autoDeferTimeout = setTimeout(() => {
		ctx.deferReply({ephemeral: command.autoDefer === AutoDeferType.EPHEMERAL});
	}, 2500 - client.ws.ping);

	await Promise.resolve(command.run(ctx)).catch(async (error) => {
		Logger.error(error.code, error.message);
		if (error.stack) Logger.trace(error.stack);
		const errorReply = () => ctx.interaction.replied ? ctx.editReply(client.responses.ERROR) : ctx.reply({
			content: client.responses.ERROR,
			ephemeral: true,
		});

		if (typeof command.onError === 'function') await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	}).then(() => {
		if (autoDeferTimeout) clearTimeout(autoDeferTimeout);
		Logger.debug(`Successfully ran command (${command.name}) for ${interaction.user.username}`);
	});
}
