import {AutoDeferType, GClient} from '../GClient';
import {Argument, ArgumentType} from '../arguments/Argument';
import {CommandContext} from './CommandContext';
import {AutocompleteContext} from './AutocompleteContext';
import {Commands} from '../managers/CommandManager';
import Logger from 'js-logger';

export enum CommandType {
	MESSAGE = 0,
	SLASH = 1,
	CONTEXT_USER = 2,
	CONTEXT_MESSAGE = 3,
}

export interface CommandArgumentChoice {
	name: string;
	value: any;
}

export interface CommandArgument {
	name: string;
	description: string;
	type: ArgumentType;
	required?: boolean;
	choices?: Array<CommandArgumentChoice>;
	options?: Array<CommandArgument | Argument>;
	run?: (ctx: AutocompleteContext) => any;
}

export type CommandInhibitor = (ctx: CommandContext) => (boolean | void | Promise<boolean> | Promise<void>);
export type CommandInhibitors = Array<{ run: CommandInhibitor } | CommandInhibitor>;


export interface CommandOptions {
	type: Array<CommandType>;
	description?: string;
	arguments?: Array<CommandArgument | Argument>;
	inhibitors?: CommandInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType;
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
	public autoDefer?: AutoDeferType;
	public readonly run: (ctx: CommandContext) => any;
	public readonly onError?: (ctx: CommandContext, error: any) => any;

	public constructor(name: string, options: CommandOptions) {
		this.name = name;
		Object.assign(this, options);

		Commands.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
		if (!this.cooldown && client.options?.cooldown) this.cooldown = client.options.cooldown;
		if (!this.autoDefer && client.options?.autoDefer) this.autoDefer = client.options.autoDefer;
	}

	public static validate(command: Command): boolean | void {
		if (!command.name) return Logger.warn('Command must have a name');
		else if (typeof command.name !== 'string') return Logger.warn('Command name must be a string');
		else if (command.description && typeof command.description !== 'string') return Logger.warn('Command', command.name, 'description must be a string');
		else if (typeof command.run !== 'function') return Logger.warn('Command', command.name, 'must have a run function');
		else return true;
	}

	public unregister(): Command {
		return Commands.unregister(this.name);
	}

	public async inhibit(ctx: CommandContext): Promise<boolean> {
		for await(const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch(error => {
					Logger.error(error.code, error.message);
					if (error.trace) Logger.trace(error.trace);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(error.code, error.message);
					if (error.trace) Logger.trace(error.trace);
				});
			}
			if (result !== true) return false;
		}
		return true;
	}
}
