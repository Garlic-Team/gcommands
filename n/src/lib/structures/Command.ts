import { AutoDeferType, GClient } from '../GClient';
import { Argument, ArgumentOptions } from './Argument';
import type { CommandContext } from './contexts/CommandContext';
import { Commands } from '../managers/CommandManager';
import Logger from 'js-logger';
import { z } from 'zod';

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
	arguments?: Array<Argument | ArgumentOptions>;
	inhibitors?: CommandInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	fileName?: string;
	run?: (ctx: CommandContext) => any;
	onError?: (ctx: CommandContext, error: any) => any;
}

const validationSchema = z
	.object({
		name: z
			.string()
			.max(32)
			.regex(/^[a-z1-9]/),
		type: z
			.union([z.string(), z.nativeEnum(CommandType)])
			.transform((arg) => (typeof arg === 'string' && Object.keys(CommandType).includes(arg) ? CommandType[arg] : arg))
			.array()
			.nonempty(),
		arguments: z.any().array().optional(),
		description: z.string().max(100).optional(),
		inhibitors: z
			.union([
				z
					.object({
						run: z.function().args(z.any()),
					})
					.strict()
					.required()
					.passthrough(),
				z.function().args(z.any()),
			])
			.array()
			.optional(),
		guildId: z.string().optional(),
		cooldown: z.string().optional(),
		autoDefer: z
			.union([z.string(), z.nativeEnum(AutoDeferType)])
			.transform((arg) => (Object.keys(AutoDeferType).includes(String(arg)) ? AutoDeferType[arg] : arg))
			.optional(),
		fileName: z.string().optional(),
		run: z.function(),
		onError: z.function().optional(),
	})
	.passthrough();

export class Command {
	public client: GClient;
	public name: string;
	public description?: string;
	public type: Array<CommandType | keyof typeof CommandType>;
	public arguments?: Array<Argument>;
	public inhibitors: CommandInhibitors;
	public guildId?: string;
	private static defaults?: Partial<CommandOptions>;
	public cooldown?: string;
	public fileName?: string;
	public run: (ctx: CommandContext) => any;
	public onError?: (ctx: CommandContext, error: any) => any;
	public owner?: string;
	public reloading = false;
	public autoDefer?: AutoDeferType | keyof typeof AutoDeferType;

	public constructor(options: CommandOptions) {
		validationSchema
			.parseAsync(options)
			.then((options) => {
				this.name = options.name || Command.defaults?.name;
				this.description = options.description || Command.defaults?.description;
				this.type = options.type || Command.defaults?.type;
				this.arguments = options.arguments?.map((argument) => {
					if (argument instanceof Argument) return argument;
					else return new Argument(argument);
				});
				this.inhibitors = (options.inhibitors as CommandInhibitors) || Command.defaults?.inhibitors;
				this.guildId = options.guildId || Command.defaults?.guildId;
				this.cooldown = options.cooldown || Command.defaults?.cooldown;
				this.fileName = options.fileName || Command.defaults?.fileName;
				this.run = options.run || Command.defaults?.run;
				this.onError = options.onError || Command.defaults?.onError;
				this.autoDefer = options.autoDefer || Command.defaults?.autoDefer;

				Commands.register(this);
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
	}

	public unregister(): Command {
		return Commands.unregister(this.name);
	}

	public async inhibit(ctx: CommandContext): Promise<boolean> {
		if (!this.inhibitors) return true;

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

	public toJSON(): Array<Record<string, any>> {
		return this.type
			.filter((type) => type !== CommandType.MESSAGE)
			.map((type) => {
				if (type === CommandType.SLASH)
					return {
						name: this.name,
						description: this.description,
						options: this.arguments?.map((argument) => argument.toJSON()),
						type: type,
					};
				else
					return {
						name: this.name,
						type: type,
					};
			});
	}

	public static setDefaults(defaults: Partial<CommandOptions>): boolean {
		try {
			validationSchema.partial().parse(defaults);
			Command.defaults = defaults;

			return true;
		} catch (error) {
			Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);

			return false;
		}
	}
}
