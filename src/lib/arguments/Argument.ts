import {CommandArgument, CommandArgumentChoice} from '../structures/Command';
import {AutocompleteContext} from '../structures/AutocompleteContext';

export enum ArgumentType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
}

export interface ArgumentOptions {
	type: ArgumentType;
	description: string;
	required?: boolean;
	choices?: Array<CommandArgumentChoice>;
	options?: Array<CommandArgument | Argument>;
	run?: (ctx: AutocompleteContext) => any;
}

export class Argument {
	public readonly name: string;
	public readonly type?: ArgumentType;
	public readonly description: string;
	public readonly required: boolean = false;
	public readonly choices?: Array<string>;
	public readonly options?: Array<CommandArgument | Argument>;
	public run?: (ctx: AutocompleteContext) => any;

	constructor(name: string, options: ArgumentOptions) {
		Argument.validate(name, options);

		this.name = name;
		Object.assign(this, options);
	}

	private static validate(name: string, options: ArgumentOptions) {
		if (!name) throw new TypeError('Argument must have a name');
		if (typeof name !== 'string') throw new TypeError('Argument name must be a string');
		if (!ArgumentType[options.type]) throw new TypeError('Argument type must be one of ArgumentType');
		if (!options.description) throw new TypeError('Argument must have a description');
		if (typeof options.description !== 'string') throw new TypeError('Argument description must be a string');
	}
}
