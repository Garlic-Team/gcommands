import type { ApplicationCommandOptionType } from 'discord-api-types/v9';
import type { AutocompleteContext } from './contexts/AutocompleteContext';
import type { LocaleString } from '../util/common';
import { Logger } from '../util/logger/Logger';
import { commandAndOptionNameRegexp } from '../util/regexes';
import { s } from '@sapphire/shapeshift';

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

const parser = s.object({
	name: s.string.lengthLe(32).regex(commandAndOptionNameRegexp),
	nameLocalizations: s.record(
		s.string.lengthLe(32).regex(commandAndOptionNameRegexp),
	).optional,
	description: s.string.lengthLe(100),
	descriptionLocalizations: s.record(s.string.lengthLe(100)),
	type: s.union(s.string, s.nativeEnum(ArgumentType)).transform(value => {
		return typeof value === 'string' &&
			Object.keys(ArgumentType).includes(value)
			? ArgumentType[value]
			: value;
	}),
	required: s.boolean.optional,
	choices: s.array(
		s.object({
			name: s.string,
			nameLocalizations: s.record(
				s.string.lengthLe(32).regex(commandAndOptionNameRegexp),
			).optional,
			value: s.union(s.string, s.number),
		}),
	).optional,
	arguments: s.any.optional,
	channelTypes: s.array(
		s.union(s.string, s.nativeEnum(ChannelType)).transform(value => {
			return typeof value === 'string' &&
				Object.keys(ChannelType).includes(value)
				? ChannelType[value]
				: value;
		}),
	),
	minValue: s.number.optional,
	maxValue: s.number.optional,
	run: s.any,
});

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
		try {
			const parsed = parser.parse({ ...options, ...this });
			this.name = parsed.name;
			this.nameLocalizations = parsed.nameLocalizations;
			this.description = parsed.description;
			this.descriptionLocalizations = parsed.descriptionLocalizations;
			this.type = parsed.type;
			this.required = parsed.required;
			this.choices = parsed.choices as Array<ArgumentChoice>;
			this.arguments = parsed.arguments?.map(argument => {
				if (argument instanceof Argument) return argument;
				else return new Argument(argument);
			});
			this.channelTypes = parsed.channelTypes;
			this.minValue = parsed.minValue;
			this.maxValue = parsed.maxValue;
			this.run = parsed.run;
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
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
