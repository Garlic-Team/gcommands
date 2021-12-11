import {GClient} from '../GClient';
import {Argument, ArgumentResolveType, ArgumentType} from '../arguments/Argument';
import {CommandContext} from './CommandContext';

export enum CommandType {
	MESSAGE = 0,
	SLASH = 1,
	CONTEXT_USER = 2,
	CONTEXT_MESSAGE = 3,
}

export interface CommandArgument {
	name: string;
	description: string;
	resolve: ArgumentResolveType;
	type: keyof ArgumentType;
	required?: boolean;
	choices?: Array<string>;
	options?: Array<CommandArgument | Argument>;
}

type CommandInhibitor = (ctx: CommandContext) => (boolean | void | Promise<boolean> | Promise<void>);
type CommandInhibitors = Array<{ run: CommandInhibitor } | CommandInhibitor>;


export interface CommandOptions {
	type: Array<CommandType>;
	description?: string;
	arguments?: Array<CommandArgument | Argument>;
	inhibitors?: CommandInhibitors;
	guildId?: string;
	cooldown?: string;
	run?: (ctx: CommandContext) => any;
	onError?: (ctx: CommandContext, error: any) => any;
}

export class Command {
	public client: GClient;
	public readonly name: string;
	public readonly description?: string;
	public readonly type: Array<CommandType>;
	public readonly arguments?: Array<CommandArgument | Argument>;
	public readonly inhibitors: CommandInhibitors = [];
	public guildId?: string;
	public cooldown?: string;
	public readonly run: (ctx: CommandContext) => any;
	public readonly onError?: (ctx: CommandContext, error: any) => any;

	public constructor(name: string, options: CommandOptions) {
		Command.validate(name, options, this.run);

		this.name = name;
		Object.assign(this, options);

		GClient.gcommands.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.devGuildId) this.guildId = client.devGuildId;
		if (!this.cooldown && client.cooldown) this.cooldown = client.cooldown;
	}

	public unregister(): Command {
		return GClient.gcommands.unregister(this.name);
	}

	public async inhibit(ctx: CommandContext): Promise<boolean> {
		for await(const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await inhibitor(ctx);
			} else if (typeof inhibitor.run === 'function') {
				result = await inhibitor.run(ctx);
			}
			if (result !== true) return false;
		}
		return true;
	}

	private static validate(name: string, options: CommandOptions, run: (ctx: CommandContext) => any): void {
		if (!name) throw new TypeError('Command must have a name');
		if (typeof name !== 'string') throw new TypeError('Command name must be a string');
		if (!options.type.every(type => [0, 1, 2, 3].includes(type))) throw new TypeError('Command type must be one of CommandType');
		if (typeof options.run !== 'function' && typeof run !== 'function') throw new TypeError('Command must have a run function');
	}
}
