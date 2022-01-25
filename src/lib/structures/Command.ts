import { AutoDeferType, GClient } from '../GClient';
import { Argument } from './Argument';
import type { CommandContext } from './contexts/CommandContext';
import { Commands } from '../managers/CommandManager';
import Logger from 'js-logger';
import { Util } from '../util/Util';

export enum CommandType {
	'MESSAGE' = 0,
	'SLASH' = 1,
	'CONTEXT_USER' = 2,
	'CONTEXT_MESSAGE' = 3,
}

export type CommandInhibitor = (ctx: CommandContext) => boolean | any;
export type CommandInhibitors = Array<{ run: CommandInhibitor } | CommandInhibitor>;

export interface CommandOptions {
	name: string;
	type: Array<CommandType | keyof typeof CommandType>;
	description?: string;
	arguments?: Array<Argument>;
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
	public readonly arguments?: Array<Argument>;
	public readonly inhibitors: CommandInhibitors = [];
	public guildId?: string;
	private static defaults?: Partial<CommandOptions>;
	public readonly cooldown?: string;
	public readonly fileName?: string;
	public readonly run: (ctx: CommandContext) => any;
	public readonly onError?: (ctx: CommandContext, error: any) => any;
	public owner?: string;
	public reloading = false;
	public readonly autoDefer?: AutoDeferType | keyof typeof AutoDeferType;

	public constructor(options: CommandOptions) {
		Object.assign(this, Command.defaults);
		Object.assign(this, options);

		if (Array.isArray(this.type))
			this.type = this.type.map((type) =>
				typeof type === 'string' && Object.keys(CommandType).includes(type) ? CommandType[type] : type,
			);
		if (typeof this.autoDefer === 'string' && Object.keys(AutoDeferType).includes(this.autoDefer))
			this.autoDefer = AutoDeferType[this.autoDefer];

		if (this.validate()) Commands.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
	}

	public unregister(): Command {
		return Commands.unregister(this.name);
	}

	public async inhibit(ctx: CommandContext): Promise<boolean> {
		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch((error) => {
					Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch((error) => {
					Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
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

	public toAPICommand(): Array<Record<string, any>> {
		return this.type
			.filter((type) => type !== CommandType.MESSAGE)
			.map((type) => {
				if (type === CommandType.SLASH)
					return {
						name: this.name,
						description: this.description,
						options: this.arguments?.map((argument) => Argument.toAPIArgument(argument)),
						type: type,
					};
				else
					return {
						name: this.name,
						type: type,
					};
			});
	}

	public static setDefaults(defaults: Partial<CommandOptions>): void {
		Command.defaults = defaults;
	}

	private validate(): boolean | void {
		const trace = Util.resolveValidationErrorTrace([this.name, this.fileName]);

		if (!this.name) return Logger.warn('Command must have a name', trace);
		else if (typeof this.name !== 'string') return Logger.warn('Command name must be a string', trace);
		else if (this.description && typeof this.description !== 'string')
			return Logger.warn('Command description must be a string', trace);
		else if (!Array.isArray(this.type) || !this.type.every((type) => Object.values(CommandType).includes(type)))
			return Logger.warn('Command type must be a array of CommandType', trace);
		else if (this.arguments && !this.arguments.every((argument) => Argument.validate(argument, this))) return;
		else if (
			this.inhibitors.length >= 1 &&
			this.inhibitors.every((inhibitor) => typeof inhibitor !== 'function' && typeof inhibitor?.run !== 'function')
		)
			return Logger.warn(
				'Command inhibitors must be a array of functions/object with run function or undefined',
				trace,
			);
		else if (this.guildId && typeof this.guildId !== 'string')
			return Logger.warn('Command guildId must be a string or undefined', trace);
		else if (this.cooldown && typeof this.cooldown !== 'string')
			return Logger.warn('Command cooldown must be a string or undefined', trace);
		else if (this.autoDefer && !Object.values(AutoDeferType).includes(this.autoDefer))
			return Logger.warn('Command autoDefer must be one of AutoDeferType or undefined', trace);
		else if (this.fileName && typeof this.fileName !== 'string')
			return Logger.warn('Command filePath must be a string or undefined', trace);
		else if (typeof this.run !== 'function') return Logger.warn('Command must have a run function', trace);
		else if (this.onError && typeof this.onError !== 'function')
			return Logger.warn('Command onError must be a function or undefined', trace);
		else return true;
	}
}
