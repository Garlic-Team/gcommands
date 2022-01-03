import {Snowflake} from 'discord.js';
import {Context} from '../lib/structures/contexts/Context';

export class UserRolesInhibitor {
	public readonly roles: Array<Snowflake>;
	public readonly every?: boolean;

	constructor(roles: Array<Snowflake>, every?: boolean) {
		this.roles = roles;
		this.every = every;
	}

	run(ctx: Context): boolean {
		return ctx.inCachedGuild() && this.roles[this.every ? 'every' : 'some'](role => ctx.member.roles.cache.has(role));
	}
}
