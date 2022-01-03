import {Snowflake} from 'discord.js';
import {Context} from '../lib/structures/contexts/Context';

export class UserOnlyInhibitor {
	public readonly userIds: Array<Snowflake>;

	constructor(userId: Array<Snowflake>) {
		this.userIds = userId;
	}

	run(ctx: Context): boolean {
		return this.userIds.includes(ctx.userId);
	}
}
