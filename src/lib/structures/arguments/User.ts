import type { Client, Guild } from 'discord.js';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

export class UserType extends MessageArgumentTypeBase {
	matches;

	validate(content: string): boolean {
		const matches = content?.match(/([0-9]+)/);

		if (!matches) return false;

		this.matches = matches;

		return true;
	}

	resolve(argument: Argument, client: Client, guild: Guild) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			user: client.users.cache.get(this.matches[1]),
			member: guild.members?.cache?.get(this.matches[1])
		};
	}
}