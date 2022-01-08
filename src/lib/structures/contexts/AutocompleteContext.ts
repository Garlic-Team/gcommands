import { Context, ContextOptions } from './Context';
import { AutocompleteInteraction, CacheType } from 'discord.js';
import { Command, CommandArgument, CommandArgumentChoice } from '../Command';
import { GClient } from '../../GClient';
import { Argument } from '../Argument';

export interface AutocompleteContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
	interaction: AutocompleteInteraction;
	command: Command;
	argument: CommandArgument | Argument;
	value: string | number;
	respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;
}

export class AutocompleteContext<Cached extends CacheType = CacheType> extends Context<Cached> {
	public interaction: AutocompleteInteraction;
	public readonly command: Command;
	public readonly commandName: string;
	public readonly argument: CommandArgument | Argument;
	public readonly argumentName: string;
	public readonly value: string | number;
	public respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;
	public inGuild: () => this is AutocompleteContext<'present'>;
	public inCachedGuild: () => this is AutocompleteContext<'cached'>;
	public inRawGuild: () => this is AutocompleteContext<'raw'>;

	constructor(client: GClient, options: AutocompleteContextOptions<Cached>) {
		super(client, options);
		this.interaction = options.interaction;
		this.command = options.command;
		this.commandName = options.command.name;
		this.argument = options.argument;
		this.argumentName = options.argument.name;
		this.value = options.value;
		this.respond = options.respond;
		this.type = 'AUTOCOMPLETE';
	}
}
