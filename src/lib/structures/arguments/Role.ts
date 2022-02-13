import type { Guild } from 'discord.js';
import { roleRegexp } from '../../util/regexes';
import { Argument, ArgumentType } from '../Argument';
import { MessageArgumentTypeBase } from './base';

export class RoleType extends MessageArgumentTypeBase {
	value;
	guild: Guild;
	constructor(guild: Guild) {
		super();

		this.guild = guild;
	}

	validate(content: string): boolean {
		const matches = roleRegexp.exec(content);
		if (!matches || !this.guild.roles.cache.get(matches?.[1])) return false;

		this.value = matches[1];

		return true;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			channel: this.guild.roles.cache.get(this.value)
		};
	}
}