import type { AutocompleteInteraction } from 'discord.js';
import { AutocompleteContext } from '../lib/structures/contexts/AutocompleteContext';
import type { Argument, ArgumentOptions } from '../lib/structures/Argument';
import { Commands } from '../lib/managers/CommandManager';
import { Logger, Events } from '../lib/util/logger/Logger';
import type { GClient } from '../lib/GClient';

export async function AutocompleteHandler(interaction: AutocompleteInteraction) {
	const client = interaction.client as GClient;

	const command = Commands.get(interaction.commandName);
	if (!command) return;

	let args: Array<Argument | ArgumentOptions> = command.arguments;

	if (interaction.options.getSubcommandGroup(false))
		args = args.find((argument) => argument.name === interaction.options.getSubcommandGroup())?.arguments;
	if (interaction.options.getSubcommand(false))
		args = args.find((argument) => argument.name === interaction.options.getSubcommand())?.arguments;

	const focused = interaction.options.getFocused(true);
	const argument = args.find((argument) => argument.name === focused.name);
	if (!argument) return;

	const ctx = new AutocompleteContext(client, {
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
		argument: argument,
		value: focused.value,
		respond: interaction.respond.bind(interaction),
	});

	await Promise.resolve(argument.run(ctx))
		.catch((error) => {
			Logger.emit(Events.HANDLER_ERROR, ctx, error);
			Logger.emit(Events.AUTOCOMPLETE_HANDLER_ERROR, ctx, error);
			Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);
		})
		.then(() => {
			Logger.emit(Events.HANDLER_RUN, ctx);
			Logger.emit(Events.AUTOCOMPLETE_HANDLER_RUN, ctx);
			Logger.debug(
				`Successfully ran autocomplete (${argument.name} -> ${command.name}) for ${interaction.user.username}`,
			);
		});
}
