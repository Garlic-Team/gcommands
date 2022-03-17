import type { PermissionResolvable } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface ClientPermissionsOptions extends InhibitorOptions {
	permissions: Array<PermissionResolvable>;
}

const defaultMessage = (permissions: PermissionResolvable[]) => {
	return `I need the following permissions to execute this command: ${permissions
		.join(', ')
		.replace(/_/g, ' ')
		.toLowerCase()}`;
};

export class ClientPermissions extends Inhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(options: ClientPermissionsOptions) {
		super(options);
		this.permissions = options.permissions;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild()) return;
		if (!ctx.guild.me.permissions.has(this.permissions))
			return this.error(this.resolveMessage(ctx, defaultMessage(this.permissions)));
		else return this.ok();
	}
}
