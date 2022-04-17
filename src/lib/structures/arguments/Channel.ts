import type { Guild } from 'discord.js';
import { MessageArgumentTypeBase } from './base';
import { channelRegexp } from '../../util/regexes';
import { Argument, ArgumentType } from '../Argument';

export class ChannelType extends MessageArgumentTypeBase {
	value;
	guild: Guild;
	constructor(guild: Guild) {
		super();

		this.guild = guild;
	}

	validate(content: string): boolean {
		const matches = channelRegexp.exec(content);
		if (!matches || !this.guild.channels.cache.get(matches?.[1])) return false;

		this.value = matches[1];

		return true;
	}

	resolve(argument: Argument) {
		return {
			...argument.toJSON(),
			type: ArgumentType[argument.type],
			channel: this.guild.channels.cache.get(this.value),
		};
	}
}
