import type { Command } from './Command';
import type { AutocompleteContext } from './contexts/AutocompleteContext';
import { Logger } from './Logger';
import { Util } from '../util/Util';
import type { ApplicationCommandOptionType } from 'discord-api-types';

export enum ArgumentType  {
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
}

export enum ChannelType {
	'GUILD_TEXT' = 0,
	'GUILD_VOICE' = 2,
	'GUILD_CATEGORY' = 4,
	'GUILD_STORE' = 6,
	'GUILD_NEWS_THREAD' = 10,
	'GUILD_PUBLIC_THREAD' = 11,
	'GUILD_PRIVATE_THREAD' = 12,
	'GUILD_STAGE_VOICE' = 13,
}

export interface ArgumentChoice {
	name: string;
	value: string;
}

export interface ArgumentOptions {
	name: string;
	description: string;
	type: ArgumentType | keyof typeof ArgumentType | ApplicationCommandOptionType | keyof typeof ApplicationCommandOptionType;
	required?: boolean;
	choices?: Array<ArgumentChoice>;
	options?: Array<Argument>;
	channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
	run?: (ctx: AutocompleteContext) => any;
}

export class Argument {
	public readonly name: string;
	public readonly description: string;
	public readonly type: ArgumentType | keyof typeof ArgumentType | ApplicationCommandOptionType | keyof typeof ApplicationCommandOptionType;
	public readonly required: boolean = false;
	public readonly choices?: Array<ArgumentChoice>;
	public readonly options?: Array<Argument>;
	public readonly channelTypes?: Array<ChannelType | keyof typeof ChannelType>;
	public run?: (ctx: AutocompleteContext) => any;

	constructor(options: ArgumentOptions) {
		Object.assign(this, options);

		if (typeof this.type === 'string' && Object.keys(ArgumentType).includes(this.type))
			this.type = ArgumentType[this.type];
	}

	public static toAPIArgument(argument: Argument): Record<string, any> {
		if (argument.type === ArgumentType.SUB_COMMAND || argument.type === ArgumentType.SUB_COMMAND_GROUP) {
			return {
				...argument,
				options: argument.options?.map(a => Argument.toAPIArgument(a)),
			};
		}

		return {
			...Util.resolveArgumentOptions(argument),
			autocomplete: typeof argument.run === 'function',
		};
	}

	public static validate(argument: Argument, command: Command): boolean | void {
		const trace = Util.resolveValidationErrorTrace([argument.name, command.name, command.fileName]);

		if (!argument.name) return Logger.warn('Argument must have a name');
		else if (typeof argument.name !== 'string') return Logger.warn('Argument name must be a string');
		else if (typeof argument.description !== 'string')
			return Logger.warn('Argument description must be a string', trace);
		else if (!Object.values(ArgumentType).includes(argument.type as string))
			return Logger.warn('Argument type must be one of ArgumentType', trace);
		else if (argument.required && typeof argument.required !== 'boolean')
			return Logger.warn('Argument required must be a boolean or undefined', trace);
		else if (
			argument.choices &&
			!argument.choices.every(choice => typeof choice.name === 'string' && typeof choice.value === 'string')
		)
			return Logger.warn('Argument choices must be a array of CommandArgumentChoice or undefined', trace);
		else if (argument.options && !argument.options.every(option => Argument.validate(option, command))) return;
		else if (argument.channelTypes && argument.type !== ArgumentType.CHANNEL)
			return Logger.warn(
				'Argument options cannot have the channelTypes property if argument type is not a channel',
				trace,
			);
		else if (
			argument.channelTypes &&
			!argument.channelTypes.every(channelType => Object.values(ChannelType).includes(channelType))
		)
			return Logger.warn('Argument channelTypes must be a array of ChannelType or undefined', trace);
		else return true;
	}
}
