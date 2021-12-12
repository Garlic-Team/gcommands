import {PermissionResolvable} from 'discord.js';
import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class ClientPermissionsInhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(permissions: Array<PermissionResolvable>) {
		this.permissions = permissions;
	}

	run(ctx: CommandContext | ComponentContext) {
		return ctx.guild && ctx.guild.me.permissions.has(this.permissions);
	}
}
