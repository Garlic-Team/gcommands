import {AutocompleteInteraction} from 'discord.js';
import {GClient} from '../lib/GClient';
import {CommandArgument} from '../lib/structures/Command';
import {Events} from '../lib/util/Events';
import {AutocompleteContext} from '../lib/structures/AutocompleteContext';
import {Argument} from '../lib/arguments/Argument';

export async function AutocompleteHandler(interaction: AutocompleteInteraction) {
	const client = interaction.client as GClient;

	const command = client.gcommands.get(interaction.commandName);
	if (!command) return;

	let args: Array<CommandArgument | Argument> = command.arguments;

	if (interaction.options.getSubcommandGroup(false)) args = args.find(argument => argument.name === interaction.options.getSubcommandGroup())?.options;
	if (interaction.options.getSubcommand(false)) args = args.find(argument => argument.name === interaction.options.getSubcommand())?.options;

	const focused = interaction.options.getFocused(true);
	const argument = args.find(argument => argument.name === focused.name);

	const ctx = AutocompleteContext.createWithInteraction(interaction, argument, focused.value);

	if (argument) await Promise.resolve(argument.run(ctx)).catch(error => client.emit(Events.ERROR, error));
}
