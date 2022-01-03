import {Context} from './Context';
import {CacheType} from 'discord.js';
import {Command, CommandArgument, CommandArgumentChoice} from '../Command';
import {GClient} from '../../GClient';
import {Argument} from '../Argument';

export interface AutocompleteContextOptions<Cached extends CacheType = CacheType> extends Context<Cached> {
	command: Command;
	argument: CommandArgument | Argument;
	value: string | number;
	respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;
}

export class AutocompleteContext<Cached extends CacheType = CacheType> extends Context<Cached> {
	public readonly command: Command;
	public readonly commandName: string;
	public readonly argument: CommandArgument | Argument;
	public readonly argumentName: string;
	public readonly value: string | number;
	public respond: (choices: Array<CommandArgumentChoice>) => Promise<void>;

	constructor(client: GClient, options: AutocompleteContextOptions<Cached>) {
		super(client, options);
		this.command = options.command;
		this.commandName = options.command.name;
		this.argument = options.argument;
		this.argumentName = options.argument.name;
		this.value = options.value;
		this.respond = options.respond;
	}

	public inGuild(): this is AutocompleteContext<'present'> {
		return super.inGuild();
	}

	public inCachedGuild(): this is AutocompleteContext<'cached'> {
		return super.inCachedGuild();
	}

	public inRawGuild(): this is AutocompleteContext<'raw'> {
		return super.inRawGuild();
	}
}
