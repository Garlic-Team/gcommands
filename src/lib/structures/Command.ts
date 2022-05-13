import { s } from '@sapphire/shapeshift';
import { Argument, ArgumentOptions } from './Argument';
import type { CommandContext } from './contexts/CommandContext';
import { AutoDeferType, GClient } from '../GClient';
import { Commands } from '../managers/CommandManager';
import type { LocaleString } from '../util/common';
import { Logger } from '../util/logger/Logger';
import { commandAndOptionNameRegexp } from '../util/regexes';

export enum CommandType {
	/**
	 * ![](https://garlic-team.js.org/guide/message.png)
	 */
	'MESSAGE' = 0,
	/**
	 * ![](https://garlic-team.js.org/guide/slash.png)
	 */
	'SLASH' = 1,
	/**
	 * ![](https://garlic-team.js.org/guide/context_user.png)
	 */
	'CONTEXT_USER' = 2,
	/**
	 * ![](https://garlic-team.js.org/guide/context_message.png)
	 */
	'CONTEXT_MESSAGE' = 3,
}

export type CommandInhibitor = (ctx: CommandContext) => boolean | any;
export type CommandInhibitors = Array<
	{ run: CommandInhibitor } | CommandInhibitor
>;

export interface CommandOptions {
	name: string;
	nameLocalizations?: Record<LocaleString, string>;
	description?: string;
	descriptionLocalizations?: Record<LocaleString, string>;
	type: Array<CommandType | keyof typeof CommandType>;
	arguments?: Array<Argument | ArgumentOptions>;
	inhibitors?: CommandInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	fileName?: string;
	run?: (ctx: CommandContext) => any;
	onError?: (ctx: CommandContext, error: any) => any;
}

const parser = s.object({
	name: s.string.lengthLessThanOrEqual(32).regex(commandAndOptionNameRegexp),
	nameLocalizations: s.record(
		s.string.lengthLessThanOrEqual(32).regex(commandAndOptionNameRegexp),
	).optional,
	description: s.string.lengthLessThanOrEqual(100),
	descriptionLocalizations: s.record(s.string.lengthLessThanOrEqual(100)),
	type: s.union(s.string, s.nativeEnum(CommandType)).transform(value => {
		return typeof value === 'string' && Object.keys(CommandType).includes(value)
			? CommandType[value]
			: value;
	}),
	arguments: s.array(s.any).optional,
	inhibitors: s.array(s.any).optional,
	guildId: s.string.optional,
	cooldown: s.string.optional,
	autoDefer: s.union(s.string, s.nativeEnum(AutoDeferType)).transform(value => {
		return typeof value === 'string' &&
			Object.keys(AutoDeferType).includes(value)
			? AutoDeferType[value]
			: value;
	}),
	fileName: s.string.optional,
	run: s.any,
	onError: s.any,
});

export class Command {
	public client: GClient;
	public name: string;
	public nameLocalizations?: Record<LocaleString, string>;
	public description?: string;
	public descriptionLocalizations?: Record<LocaleString, string>;
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
		try {
			const parsed = parser.passthrough.parse({ ...options, ...this });

			this.name = parsed.name || Command.defaults?.name;
			this.nameLocalizations =
				parsed.nameLocalizations || Command.defaults?.nameLocalizations;
			this.description = parsed.description || Command.defaults?.description;
			this.descriptionLocalizations =
				parsed.descriptionLocalizations ||
				Command.defaults?.descriptionLocalizations;
			this.type = parsed.type || Command.defaults?.type;
			this.arguments = parsed.arguments?.map(argument => {
				if (argument instanceof Argument) return argument;
				else return new Argument(argument);
			});
			this.inhibitors = parsed.inhibitors || Command.defaults?.inhibitors;
			this.guildId = parsed.guildId || Command.defaults?.guildId;
			this.cooldown = parsed.cooldown || Command.defaults?.cooldown;
			this.fileName = parsed.fileName || Command.defaults?.fileName;
			this.run = parsed.run || Command.defaults?.run;
			this.onError = parsed.onError || Command.defaults?.onError;
			this.autoDefer = parsed.autoDefer || Command.defaults?.autoDefer;

			Commands.register(this);
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId)
			this.guildId = client.options.devGuildId;
	}

	public unregister(): Command {
		return Commands.unregister(this.name);
	}

	public async inhibit(ctx: CommandContext): Promise<boolean> {
		if (!this.inhibitors) return true;

		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch(error => {
					Logger.error(
						typeof error.code !== 'undefined' ? error.code : '',
						error.message,
					);
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(
						typeof error.code !== 'undefined' ? error.code : '',
						error.message,
					);
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
			.filter(type => type !== CommandType.MESSAGE)
			.map(type => {
				if (type === CommandType.SLASH) {
					return {
						name: this.name,
						name_localizations: this.nameLocalizations,
						description: this.description,
						description_localizations: this.descriptionLocalizations,
						options: this.arguments?.map(argument => argument.toJSON()),
						type: type,
					};
				} else {
					return {
						name: this.name,
						type: type,
					};
				}
			});
	}

	public static setDefaults(defaults: Partial<CommandOptions>): void {
		try {
			Command.defaults = parser.partial.passthrough.parse(defaults);
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
	}
}
