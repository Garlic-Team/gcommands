import {Command, CommandArgument, CommandArgumentChoice} from '../structures/Command';
import {AutocompleteContext} from '../structures/AutocompleteContext';
import Logger from 'js-logger';

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
}

export interface ArgumentOptions {
	description: string;
	type: ArgumentType | keyof typeof ArgumentType;
	required?: boolean;
	choices?: Array<CommandArgumentChoice>;
	options?: Array<CommandArgument | Argument>;
	run?: (ctx: AutocompleteContext) => any;
}

export class Argument {
	public readonly name: string;
	public readonly description: string;
	public readonly type: ArgumentType | keyof typeof ArgumentType;
	public readonly required: boolean = false;
	public readonly choices?: Array<CommandArgumentChoice>;
	public readonly options?: Array<CommandArgument | Argument>;
	public run?: (ctx: AutocompleteContext) => any;

	constructor(name: string, options: ArgumentOptions) {
		this.name = name;
		Object.assign(this, options);

		if (typeof this.type === 'string' && Object.keys(ArgumentType).includes(this.type)) this.type = ArgumentType[this.type];
	}

	public static validate(argument: Argument | CommandArgument, command: Command): boolean | void {
		const locate = `(${argument.name} -> ${command.name}${command.fileName ? ` -> ${command.fileName}` : ''})`;

		if (!argument.name) return Logger.warn('Argument must have a name');
		else if (typeof argument.name !== 'string') return Logger.warn('Argument name must be a string');
		else if (typeof argument.description !== 'string') return Logger.warn('Argument description must be a string', locate);
		else if (!Object.values(ArgumentType).includes(argument.type)) return Logger.warn('Argument type must be one of ArgumentType', locate);
		else if (argument.required && typeof argument.required !== 'boolean') return Logger.warn('Argument required must be a boolean or undefined', locate);
		else if (argument.choices && !argument.choices.every(choice => typeof choice.name === 'string' && typeof choice.value === 'string')) return Logger.warn('Argument choices must be a array of CommandArgumentChoice or undefined', locate);
		else if (argument.options && !argument.options.every(option => Argument.validate(option, command))) return;
		else return true;
	}
}
