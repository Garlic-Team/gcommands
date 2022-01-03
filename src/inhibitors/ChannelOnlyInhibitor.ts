import {Snowflake} from 'discord.js';
import {Context} from '../lib/structures/contexts/Context';

export class ChannelOnlyInhibitor {
	public readonly channelIds: Array<Snowflake>;

	constructor(channelIds: Array<Snowflake>) {
		this.channelIds = channelIds;
	}

	run(ctx: Context): boolean {
		return this.channelIds.includes(ctx.channelId);
	}
}
