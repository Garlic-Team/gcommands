import { z } from 'zod';
import { Argument, ArgumentOptions } from './Argument';
import type { CommandContext } from './contexts/CommandContext';
import { AutoDeferType, GClient } from '../GClient';
import { Commands } from '../managers/CommandManager';
import { Locale, LocaleString } from '../util/common';
import { Logger } from '../util/logger/Logger';
import { commandAndOptionNameRegexp } from '../util/regexes';
import { PermissionResolvable, Permissions } from 'discord.js';
import { Util } from '../util/Util';

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

export type CommandInhibitor =
	| ((ctx: CommandContext) => boolean | any)
	| { run: CommandInhibitor };
export type CommandInhibitors = Array<CommandInhibitor>;

export interface CommandOptions {
	name: string;
	nameLocalizations?: Record<LocaleString, string>;
	description?: string;
	descriptionLocalizations?: Record<LocaleString, string>;
	type: Array<CommandType | keyof typeof CommandType>;
	category?: string;
	defaultMemberPermissions?: PermissionResolvable;
	dmPermission?: boolean;
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
		name: z.string().max(32).regex(commandAndOptionNameRegexp),
		nameLocalizations: z
			.record(
				z
					.union([z.string(), z.nativeEnum(Locale)])
					.transform(arg =>
						typeof arg === 'string' && Object.keys(Locale).includes(arg)
							? Locale[arg]
							: arg,
					),
				z.string().max(32).regex(commandAndOptionNameRegexp),
			)
			.optional(),
		description: z.string().max(100).optional(),
		descriptionLocalizations: z
			.record(
				z
					.union([z.string(), z.nativeEnum(Locale)])
					.transform(arg =>
						typeof arg === 'string' && Object.keys(Locale).includes(arg)
							? Locale[arg]
							: arg,
					),
				z.string().max(100),
			)
			.optional(),
		type: z
			.union([z.string(), z.nativeEnum(CommandType)])
			.transform(arg =>
				typeof arg === 'string' && Object.keys(CommandType).includes(arg)
					? CommandType[arg]
					: arg,
			)
			.array()
			.nonempty(),
		category: z.string().optional(),
		defaultMemberPermissions: z.any().optional(),
		dmPermission: z.boolean().optional(),
		arguments: z.any().array().optional(),
		inhibitors: z.any().array().optional().default([]),
		guildId: z.string().optional(),
		cooldown: z.string().optional(),
		autoDefer: z
			.union([z.string(), z.nativeEnum(AutoDeferType)])
			.transform(arg =>
				typeof arg === 'string' && Object.keys(AutoDeferType).includes(arg)
					? AutoDeferType[arg]
					: arg,
			)
			.optional(),
		fileName: z.string().optional(),
		run: z.function(),
		onError: z.function().optional(),
	})
	.passthrough();

export class Command {
	public client: GClient;
	public name: string;
	public nameLocalizations?: Record<LocaleString, string>;
	public description?: string;
	public descriptionLocalizations?: Record<LocaleString, string>;
	public type: Array<CommandType | keyof typeof CommandType>;
	public category?: string;
	public defaultMemberPermissions?: PermissionResolvable;
	public dmPermission?: boolean;
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
		if (this.run) options.run = this.run;
		if (this.onError) options.onError = this.onError;

		validationSchema
			.parseAsync({ ...options, ...this })
			.then(options => {
				this.name = options.name || Command.defaults?.name;
				this.nameLocalizations =
					options.nameLocalizations || Command.defaults?.nameLocalizations;
				this.description = options.description || Command.defaults?.description;
				this.descriptionLocalizations =
					options.descriptionLocalizations ||
					Command.defaults?.descriptionLocalizations;
				this.type = options.type || Command.defaults?.type;
				this.defaultMemberPermissions =
					options.defaultMemberPermissions ||
					Command.defaults?.defaultMemberPermissions;
				this.dmPermission =
					options.dmPermission || Command.defaults?.dmPermission;
				this.arguments = options.arguments?.map(argument => {
					if (argument instanceof Argument) return argument;
					else return new Argument(argument);
				});
				this.inhibitors = options.inhibitors || Command.defaults?.inhibitors;
				this.guildId = options.guildId || Command.defaults?.guildId;
				this.category = options.category;
				this.cooldown = options.cooldown || Command.defaults?.cooldown;
				this.fileName = options.fileName || Command.defaults?.fileName;
				this.run = options.run || Command.defaults?.run;
				this.onError = options.onError || Command.defaults?.onError;
				this.autoDefer = options.autoDefer || Command.defaults?.autoDefer;

				Commands.register(this);
			})
			.catch(error => {
				Logger.warn(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
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
			if ((await Util.runInhibitor(ctx, inhibitor)) !== true) return false;
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
						dm_permission: this.dmPermission,
						default_member_permissions: this.defaultMemberPermissions
							? new Permissions(
									this.defaultMemberPermissions,
							  ).bitfield.toString()
							: null,
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
		validationSchema
			.partial()
			.parseAsync(defaults)
			.then(defaults => {
				Command.defaults = defaults as Partial<CommandOptions>;
			})
			.catch(error => {
				Logger.warn(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
	}
}
