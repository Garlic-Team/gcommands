import {CommandArgument} from '../structures/Command';

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

export enum ArgumentResolveType {
	VALUE = 'value',
	USER = 'user',
	MEMBER = 'member',
	ROLE = 'role',
	CHANNEL = 'channel'
}

export interface ArgumentOptions {
	type: ArgumentType;
	description: string;
	resolve?: ArgumentResolveType;
	required?: boolean;
	choices?: Array<string>;
	options?: Array<CommandArgument | Argument>;
}

export class Argument {
	public readonly name: string;
	public readonly type?: ArgumentType;
	public readonly description: string;
	public readonly resolve: ArgumentResolveType;
	public readonly required: boolean = false;
	public readonly choices?: Array<string>;
	public readonly options?: Array<CommandArgument | Argument>;

	constructor(name: string, options: ArgumentOptions) {
		Argument.validate(name, options);

		if (!options.resolve) {
			if (options.type === ArgumentType.USER) options.resolve = ArgumentResolveType.USER;
			else if (options.type === ArgumentType.ROLE) options.resolve = ArgumentResolveType.ROLE;
			else if (options.type === ArgumentType.CHANNEL) options.resolve = ArgumentResolveType.CHANNEL;
		}

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
