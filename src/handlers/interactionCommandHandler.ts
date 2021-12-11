import {Collection, CommandInteraction, ContextMenuInteraction} from 'discord.js';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {CommandContext} from '../lib/structures/CommandContext';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function interactionCommandHandler(interaction: CommandInteraction | ContextMenuInteraction) {
	const command = GClient.gcommands.get(interaction.commandName);
	if (!command) return interaction.reply({
		content: GClient.responses.NOT_FOUND,
		ephemeral: true
	});

	if (command.cooldown) {
		const cooldown = GClient.ghandlers.cooldownHandler(interaction.user.id, command, cooldowns);
		if (cooldown) return interaction.reply({
			content: GClient.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', command.name + ' command'),
			ephemeral: true,
		});
	}

	const ctx = CommandContext.createWithInteraction(interaction, command);

	if (!await command.inhibit(ctx)) return;
	await Promise.resolve(command.run(ctx)).catch(async (error) => {
		ctx.client.emit(Events.ERROR, error);
		const errorReply = () => ctx.interaction.replied ? ctx.editReply(GClient.responses.ERROR) : ctx.reply({
			content: GClient.responses.ERROR,
			ephemeral: true,
		});
		if (typeof command.onError === 'function') await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	});
}
