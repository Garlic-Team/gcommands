import {Snowflake} from 'discord.js';
import {Context} from '../lib/structures/contexts/Context';

export class ClientRolesInhbitor {
	public readonly roles: Array<Snowflake>;
	public readonly every?: boolean;

	constructor(roles: Array<Snowflake>, every?: boolean) {
		this.roles = roles;
		this.every = every;
	}

	run(ctx: Context): boolean {
		return ctx.guild && this.roles[this.every ? 'every' : 'some'](role => ctx.guild.me.roles.cache.has(role));
	}
}
