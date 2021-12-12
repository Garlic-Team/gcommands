import {BaseContext, BaseContextOptions} from './BaseContext';
import {GClient} from '../GClient';
import {CommandArgument, CommandArgumentChoice} from './Command';
import {AutocompleteInteraction} from 'discord.js';
import {Argument} from '../arguments/Argument';

export interface AutocompleteContextOptions extends BaseContextOptions {
	interaction: AutocompleteInteraction;
	respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;
	argument: CommandArgument | Argument;
	value: any;
}

export class AutocompleteContext extends BaseContext {
	public interaction: AutocompleteInteraction;
	public respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;
	public argument: CommandArgument | Argument;
	public value: any;

	protected constructor(client: GClient, options: AutocompleteContextOptions) {
		super(client, options);
	}

	public static createWithInteraction(interaction: AutocompleteInteraction, argument: CommandArgument | Argument, value: any) {
		return new this(interaction.client as GClient, {
			...(super.createBaseWithInteraction(interaction)),
			interaction: interaction,
			respond: interaction.respond.bind(interaction),
			argument: argument,
			value: value,
		});
	}
}
