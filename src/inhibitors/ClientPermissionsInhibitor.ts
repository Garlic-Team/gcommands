import {PermissionResolvable} from 'discord.js';
import {Context} from '../lib/structures/contexts/Context';

export class ClientPermissionsInhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(permissions: Array<PermissionResolvable>) {
		this.permissions = permissions;
	}

	run(ctx: Context): boolean {
		return ctx.guild && ctx.guild.me.permissions.has(this.permissions);
	}
}
