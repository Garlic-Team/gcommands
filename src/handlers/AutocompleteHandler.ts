import type { AutocompleteInteraction } from 'discord.js';
import type { CommandArgument } from '../lib/structures/Command';
import { AutocompleteContext } from '../lib/structures/contexts/AutocompleteContext';
import type { Argument } from '../lib/structures/Argument';
import { Commands } from '../lib/managers/CommandManager';
import Logger from 'js-logger';
import type { GClient } from '../lib/GClient';

export async function AutocompleteHandler(interaction: AutocompleteInteraction) {
	const client = interaction.client as GClient;

	const command = Commands.get(interaction.commandName);
	if (!command) return;

	let args: Array<CommandArgument | Argument> = command.arguments;

	if (interaction.options.getSubcommandGroup(false))
		args = args.find((argument) => argument.name === interaction.options.getSubcommandGroup())?.options;
	if (interaction.options.getSubcommand(false))
		args = args.find((argument) => argument.name === interaction.options.getSubcommand())?.options;

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
			Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);
		})
		.then(() => {
			Logger.debug(
				`Successfully ran autocomplete (${argument.name} -> ${command.name}) for ${interaction.user.username}`,
			);
		});
}
