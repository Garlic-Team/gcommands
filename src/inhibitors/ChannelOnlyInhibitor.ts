import {BaseContext} from '../lib/structures/BaseContext';
import {Snowflake} from 'discord.js';

export class ChannelOnlyInhibitor {
	public readonly channelIds: Array<Snowflake>;

	constructor(channelIds: Array<Snowflake>) {
		this.channelIds = channelIds;
	}

	run(ctx: BaseContext): boolean {
		return this.channelIds.includes(ctx.channelId);
	}
}
