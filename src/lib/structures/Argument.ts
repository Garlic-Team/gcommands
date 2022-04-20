import type { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { z } from 'zod';
import type { AutocompleteContext } from './contexts/AutocompleteContext';
import { Locale, LocaleString } from '../util/common';
import { Logger } from '../util/logger/Logger';
import { commandAndOptionNameRegexp } from '../util/regexes';

export enum ArgumentType {
	'SUB_COMMAND' = 1,
	'SUB_COMMAND_GROUP' = 2,
	'STRING' = 3,
	'INTEGER' = 4,
	'BOOLEAN' = 5,
	'USER' = 6,
	'CHANNEL' = 7,
	'ROLE' = 8,
	'MENTIONABLE' = 9,
	'NUMBER' = 10,
	'ATTACHMENT' = 11,
}

export enum ChannelType {
	'GUILD_TEXT' = 0,
	'GUILD_VOICE' = 2,
	'GUILD_CATEGORY' = 4,
	'GUILD_NEWS' = 5,
	'GUILD_STORE' = 6,
	'GUILD_NEWS_THREAD' = 10,
	'GUILD_PUBLIC_THREAD' = 11,
	'GUILD_PRIVATE_THREAD' = 12,
	'GUILD_STAGE_VOICE' = 13,
}

export interface ArgumentChoice {
	name: string;
	nameLocalizations?: Record<LocaleString, string>;
	value: string | number;
}

export interface ArgumentOptions {
	name: string;
	nameLocalizations?: Record<LocaleString, string>;
	description: string;
	descriptionLocalizations?: Record<LocaleString, string>;
	type:
		| ArgumentType
		| keyof typeof ArgumentType
		| ApplicationCommandOptionType
		| keyof typeof ApplicationCommandOptionType;
	required?: boolean;
	choices?: Array<ArgumentChoice>;
	arguments?: Array<Argument | ArgumentOptions>;
	/**
	 * @deprecated Please use ArgumentOptions#arguments instead
	 * @link https://garlic-team.js.org/docs/#/docs/gcommands/next/typedef/ArgumentOptions
	 */
	options?: Array<Argument | ArgumentOptions>;
	channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
	minValue?: number;
	maxValue?: number;
	run?: (ctx: AutocompleteContext) => any;
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
		description: z.string().max(100),
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
			.union([z.string(), z.nativeEnum(ArgumentType)])
			.transform(arg =>
				typeof arg === 'string' && Object.keys(ArgumentType).includes(arg)
					? ArgumentType[arg]
					: arg,
			),
		required: z.boolean().optional(),
		choices: z
			.object({
				name: z.string(),
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
						z.number(),
					)
					.optional(),
				value: z.union([z.string(), z.number()]),
			})
			.array()
			.optional(),
		options: z.any().array().optional(),
		arguments: z.any().array().optional(),
		channelTypes: z
			.union([z.string(), z.nativeEnum(ChannelType)])
			.transform(arg =>
				typeof arg === 'string' && Object.keys(ChannelType).includes(arg)
					? ChannelType[arg]
					: arg,
			)
			.array()
			.optional(),
		minValue: z.number().optional(),
		maxValue: z.number().optional(),
		run: z.function().optional(),
	})
	.passthrough();

export class Argument {
	public name: string;
	public nameLocalizations?: Record<LocaleString, string>;
	public description: string;
	public descriptionLocalizations?: Record<LocaleString, string>;
	public type: ArgumentType | keyof typeof ArgumentType;
	public required?: boolean;
	public choices?: Array<ArgumentChoice>;
	public arguments?: Array<Argument>;
	/**
	 * @deprecated Please use Argument#arguments instead
	 * @link https://garlic-team.js.org/docs/#/docs/gcommands/next/typedef/ArgumentOptions
	 */
	public options?: Array<Argument>;
	public channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
	public minValue?: number;
	public maxValue?: number;
	public run?: (ctx: AutocompleteContext) => any;

	constructor(options: ArgumentOptions) {
		if (options.options) {
			Logger.warn(
				'The use of ArgumentOptions#options is depracted. Please use ArgumentOptions#arguments instead',
			);
			options.arguments = options.options;
		}

		if (this.run) options.run = this.run;

		validationSchema
			.parseAsync({ ...options, ...this })
			.then(options => {
				this.name = options.name;
				this.nameLocalizations = options.nameLocalizations;
				this.description = options.description;
				this.descriptionLocalizations = options.descriptionLocalizations;
				this.type = options.type;
				this.required = options.required;
				this.choices = options.choices as Array<ArgumentChoice>;
				this.arguments = options.arguments?.map(argument => {
					if (argument instanceof Argument) return argument;
					else return new Argument(argument);
				});
				this.options = this.arguments;
				this.channelTypes = options.channelTypes;
				this.minValue = options.minValue;
				this.maxValue = options.maxValue;
				this.run = options.run;
			})
			.catch(error => {
				Logger.warn(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
	}

	public toJSON(): Record<string, any> {
		if (
			this.type === ArgumentType.SUB_COMMAND ||
			this.type === ArgumentType.SUB_COMMAND_GROUP
		) {
			return {
				name: this.name,
				name_localizations: this.nameLocalizations,
				description: this.description,
				description_localizations: this.descriptionLocalizations,
				type: this.type,
				options: this.arguments?.map(argument => argument.toJSON()),
			};
		}

		return {
			name: this.name,
			name_localizations: this.nameLocalizations,
			description: this.description,
			description_localizations: this.descriptionLocalizations,
			type: this.type,
			required: this.required,
			choices: this.choices,
			channel_types: this.channelTypes,
			min_value: this.minValue,
			max_value: this.maxValue,
			autocomplete: typeof this.run === 'function',
		};
	}
}
