import {AutoDeferType, GClient} from '../GClient';
import {Argument, ArgumentType} from '../arguments/Argument';
import {CommandContext} from './CommandContext';
import {AutocompleteContext} from './AutocompleteContext';
import {Commands} from '../managers/CommandManager';
import Logger from 'js-logger';

export enum CommandType {
	'MESSAGE' = 0,
	'SLASH' = 1,
	'CONTEXT_USER' = 2,
	'CONTEXT_MESSAGE' = 3,
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
	type: Array<CommandType | keyof typeof CommandType>;
	description?: string;
	arguments?: Array<CommandArgument | Argument>;
	inhibitors?: CommandInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	fileName?: string;
	run?: (ctx: CommandContext) => any;
	onError?: (ctx: CommandContext, error: any) => any;
}

export class Command {
	public client: GClient;
	public readonly name: string;
	public readonly description?: string;
	public readonly type: Array<CommandType | keyof typeof CommandType>;
	public readonly arguments?: Array<CommandArgument | Argument>;
	public readonly inhibitors: CommandInhibitors = [];
	public guildId?: string;
	public cooldown?: string;
	public autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	public readonly fileName?: string;
	public readonly run: (ctx: CommandContext) => any;
	public readonly onError?: (ctx: CommandContext, error: any) => any;
	public reloading = false;

	public constructor(name: string, options: CommandOptions) {
		this.name = name;
		Object.assign(this, options);

		if (Array.isArray(this.type)) this.type = this.type.map(type => typeof type === 'string' && Object.keys(CommandType).includes(type) ? CommandType[type] : type);
		if (typeof this.autoDefer === 'string' && Object.keys(AutoDeferType).includes(this.autoDefer)) this.autoDefer = AutoDeferType[this.autoDefer];

		Commands.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
		if (!this.cooldown && client.options?.cooldown) this.cooldown = client.options.cooldown;
		if (!this.autoDefer && client.options?.autoDefer) this.autoDefer = client.options.autoDefer;
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
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(error.code, error.message);
					if (error.stack) Logger.trace(error.stack);
				});
			}
			if (result !== true) return false;
		}
		return true;
	}

	public async reload(): Promise<Command> {
		if (!this.fileName) return;

		this.reloading = true;

		delete require.cache[require.resolve(this.fileName)];
		await import(this.fileName);

		return Commands.get(this.name);
	}

	public static validate(command: Command): boolean | void {
		const locate = `(${command.name}${command.fileName ? `-> ${command.fileName}` : ''})`;

		if (!command.name) return Logger.warn('Command must have a name');
		else if (typeof command.name !== 'string') return Logger.warn('Command name must be a string');
		else if (command.description && typeof command.description !== 'string') return Logger.warn('Command description must be a string', locate);
		else if (!Array.isArray(command.type) || !command.type.every(type => Object.values(CommandType).includes(type))) return Logger.warn('Command type must be a array of CommandType', locate);
		else if (command.arguments && !command.arguments.every(argument => typeof argument.name === 'string' && typeof argument.description === 'string' && Object.values(ArgumentType).includes(argument.type))) return Logger.warn('Command arguments must be a array of CommandArgument/Argument or undefined', locate);
		else if (!command.inhibitors.every(inhibitor => typeof inhibitor !== 'function' && typeof inhibitor?.run !== 'function')) return Logger.warn('Command inhibitors must be a array of functions/object with run function or undefined', locate);
		else if (command.guildId && typeof command.guildId !== 'string') return Logger.warn('Command guildId must be a string or undefined', locate);
		else if (command.cooldown && typeof command.cooldown !== 'string') return Logger.warn('Command cooldown must be a string or undefined', locate);
		else if (command.autoDefer && !Object.values(AutoDeferType).includes(command.autoDefer)) return Logger.warn('Command autoDefer must be one of AutoDeferType or undefined', locate);
		else if (command.fileName && typeof command.fileName !== 'string') return Logger.warn('Command filePath must be a string or undefined', locate);
		else if (typeof command.run !== 'function') return Logger.warn('Command must have a run function', locate);
		else if (command.onError && typeof command.onError !== 'function') return Logger.warn('Command onError must be a function or undefined', locate);
		else return true;
	}
}
