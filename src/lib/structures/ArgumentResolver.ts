import {Channel, GuildMember, Role, User} from 'discord.js';
import {ArgumentsToObject} from '../util/ArgumentsToObject';
import {ArgumentsToArray} from '../util/ArgumentsToArray';
import {StringToBoolean} from '../util/StringToBoolean';

export class ArgumentResolver {
	public options: Array<any>;
	public array: Array<any>;
	public object: Record<string, any>;
	public subcommand: string;
	public subcommandgroup: string;

	public constructor(options) {
		this.options = options;

		this.object = ArgumentsToObject(options);
		this.array = ArgumentsToArray(options);

		if (options[0]?.type === 'SUB_COMMAND_GROUP') {
			this.subcommandgroup = options[0].name;
			this.options = options[0].options;
		}
		if (options[0]?.type === 'SUB_COMMAND') {
			this.subcommand = options[0].name;
			this.options = options[0].options;
		}
	}

	private get(name: string, value: string) {
		const argument = this.options?.find(argument => argument.name === name);
		return argument ? argument[value] : undefined;
	}

	public getString(name: string): string {
		const argument = this.get(name, 'value');

		return argument ? String(argument) : undefined;
	}

	public getInteger(name: string): number {
		const argument = this.get(name, 'value');

		return argument ? Number.parseInt(argument) : undefined;
	}

	public getBoolean(name: string): boolean {
		const argument = this.get(name, 'value');

		return argument ? StringToBoolean(argument) : undefined;
	}

	public getUser(name: string): User {
		const argument = this.get(name, 'user');

		return argument || undefined;
	}

	public getMember(name: string): GuildMember {
		const argument = this.get(name, 'member');

		return argument || undefined;
	}

	public getChannel(name: string): Channel {
		const argument = this.get(name, 'channel');

		return argument || undefined;
	}

	public getRole(name: string): Role {
		const argument = this.get(name, 'role');

		return argument || undefined;
	}

	public getMentionable(name: string): User | GuildMember | Role {
		return this.get(name, 'user') || this.get(name, 'member') || this.get(name, 'role');
	}

	public getNumber(name: string): number {
		const argument = this.get(name, 'value');

		return argument ? Number(argument) : undefined;
	}
}
