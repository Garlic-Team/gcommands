import type { PermissionResolvable } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface MemberPermissionsOptions extends InhibitorOptions {
	permissions: Array<PermissionResolvable>;
}

const defaultMessage = (permissions: PermissionResolvable[]) => {
	return `You need the following permissions to execute this command: ${permissions
		.join(', ')
		.replace(/_/g, ' ')
		.toLowerCase()}`;
};

export class MemberPermissions extends Inhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(options: MemberPermissionsOptions) {
		super(options);
		this.permissions = options.permissions;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild()) return;
		if (!ctx.memberPermissions.has(this.permissions))
			return this.error(this.resolveMessage(ctx, defaultMessage(this.permissions)));
		else return this.ok();
	}
}
