import {BaseContext} from '../lib/structures/BaseContext';
import {Snowflake} from 'discord.js';

export class UserOnlyInhibitor {
	public readonly userIds: Array<Snowflake>;

	constructor(userId: Array<Snowflake>) {
		this.userIds = userId;
	}

	run(ctx: BaseContext): boolean {
		return this.userIds.includes(ctx.userId);
	}
}
