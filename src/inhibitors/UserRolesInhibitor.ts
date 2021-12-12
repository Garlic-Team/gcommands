import {PermissionResolvable, RoleResolvable} from 'discord.js';
import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class UserRolesInhibitor {
	public readonly roles: Array<RoleResolvable>;

	constructor(roles: Array<RoleResolvable>) {
		this.roles = roles;
	}

	run(ctx: CommandContext | ComponentContext) {
		return ctx.guild && ctx.member.roles.cache.some(role => ctx.member.roles.cache.has(role.id));
	}
}
