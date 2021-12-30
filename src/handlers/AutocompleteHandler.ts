import {AutocompleteInteraction} from 'discord.js';
import {CommandArgument} from '../lib/structures/Command';
import {AutocompleteContext} from '../lib/structures/AutocompleteContext';
import {Argument} from '../lib/structures/Argument';
import {Commands} from '../lib/managers/CommandManager';
import Logger from 'js-logger';

export async function AutocompleteHandler(interaction: AutocompleteInteraction) {
	const command = Commands.get(interaction.commandName);
	if (!command) return;

	let args: Array<CommandArgument | Argument> = command.arguments;

	if (interaction.options.getSubcommandGroup(false)) args = args.find(argument => argument.name === interaction.options.getSubcommandGroup())?.options;
	if (interaction.options.getSubcommand(false)) args = args.find(argument => argument.name === interaction.options.getSubcommand())?.options;

	const focused = interaction.options.getFocused(true);
	const argument = args.find(argument => argument.name === focused.name);
	if (!argument) return;

	const ctx = AutocompleteContext.createWithInteraction(interaction, argument, focused.value);

	await Promise.resolve(argument.run(ctx)).catch(error => {
		Logger.error(error.code, error.message);
		if (error.stack) Logger.trace(error.stack);
	}).then(() => {
		Logger.debug(`Successfully ran autocomplete (${argument.name} -> ${command.name}) for ${interaction.user.username}`);
	});
}
