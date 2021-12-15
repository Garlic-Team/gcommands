import {Collection, CommandInteraction, ContextMenuInteraction} from 'discord.js';
import {AutoDeferType, GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {CommandContext} from '../lib/structures/CommandContext';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function InteractionCommandHandler(interaction: CommandInteraction | ContextMenuInteraction) {
	const client = interaction.client as GClient;

	const command = client.gcommands.get(interaction.commandName);
	if (!command) return interaction.reply({
		content: client.responses.NOT_FOUND,
		ephemeral: true
	});

	if (command.cooldown) {
		const cooldown = client.ghandlers.cooldownHandler(interaction.user.id, command, cooldowns);
		if (cooldown) return interaction.reply({
			content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', command.name + ' command'),
			ephemeral: true,
		});
	}

	const ctx = CommandContext.createWithInteraction(interaction, command);

	if (!await command.inhibit(ctx)) return;

	let autoDeferTimeout;
	if (command.autoDefer) autoDeferTimeout = setTimeout(() => {
		if (command.autoDefer) interaction.deferReply({ephemeral: command.autoDefer === AutoDeferType.EPHEMERAL});
	}, 2500 - client.ws.ping);

	await Promise.resolve(command.run(ctx)).catch(async (error) => {
		ctx.client.emit(Events.ERROR, error);
		const errorReply = () => ctx.interaction.replied ? ctx.editReply(client.responses.ERROR) : ctx.reply({
			content: client.responses.ERROR,
			ephemeral: true,
		});
		if (typeof command.onError === 'function') await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	}).then(() => {
		if (autoDeferTimeout) clearTimeout(autoDeferTimeout);
	});
}
