import {PermissionResolvable} from 'discord.js';
import {BaseContext} from '../lib/structures/BaseContext';

export class ClientPermissionsInhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(permissions: Array<PermissionResolvable>) {
		this.permissions = permissions;
	}

	run(ctx: BaseContext): boolean {
		return ctx.guild && ctx.guild.me.permissions.has(this.permissions);
	}
}
