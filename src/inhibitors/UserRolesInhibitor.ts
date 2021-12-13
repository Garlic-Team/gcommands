import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class UserRolesInhibitor {
	public readonly roles: Array<string>;
	public readonly every?: boolean;

	constructor(roles: Array<string>, every?: boolean) {
		this.roles = roles;
		this.every = every;
	}

	run(ctx: CommandContext | ComponentContext): boolean {
		return ctx.guild && this.roles[this.every ? 'every' : 'some'](role => ctx.member.roles.cache.has(role));
	}
}