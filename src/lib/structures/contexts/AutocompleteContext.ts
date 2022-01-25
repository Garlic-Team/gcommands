import { Context, ContextOptions } from './Context';
import type { AutocompleteInteraction, CacheType } from 'discord.js';
import type { Command } from '../Command';
import type { GClient } from '../../GClient';
import type { Argument, ArgumentChoice } from '../Argument';

export interface AutocompleteContextOptions<Cached extends CacheType = CacheType> extends ContextOptions<Cached> {
	interaction: AutocompleteInteraction;
	command: Command;
	argument: Argument;
	value: string | number;
	respond: (choices: Array<ArgumentChoice>) => Promise<void>;
}

export class AutocompleteContext<Cached extends CacheType = CacheType> extends Context<Cached> {
	public interaction: AutocompleteInteraction;
	public readonly command: Command;
	public readonly commandName: string;
	public readonly argument: Argument;
	public readonly argumentName: string;
	public readonly value: string | number;
	public respond: (choices: Array<ArgumentChoice>) => Promise<void>;
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
