import type { Client, Guild } from 'discord.js';
import { userRegexp } from '../../util/regexes';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

export class UserType extends MessageArgumentTypeBase {
	value;
	guild: Guild;
	client: Client;
	constructor(guild: Guild) {
		super();

		this.client = guild.client;
		this.guild = guild;
	}

	validate(content: string): boolean {
		const matches = userRegexp.exec(content);
		if (!matches || !this.client.users.cache.get(matches?.[1])) return false;

		this.value = matches[1];

		return true;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			user: this.client.users.cache.get(this.value),
			member: this.guild.members.cache.get(this.value)
		};
	}
}