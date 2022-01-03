import {PermissionResolvable} from 'discord.js';
import {Inhibitor, InhibitorOptions} from './Inhibitor';
import {CommandContext} from '../lib/structures/contexts/CommandContext';
import {ComponentContext} from '../lib/structures/contexts/ComponentContext';

export interface UserPermissionsOptions extends InhibitorOptions {
	permissions: Array<PermissionResolvable>;
}

export class UserPermissions extends Inhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(options: UserPermissionsOptions) {
		super(options);
		this.permissions = options.permissions;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild()) return;
		if (!ctx.memberPermissions.has(this.permissions)) return ctx.reply(this.resolveMessage(ctx) || `You need the following permissions to execute this command: ${this.permissions.join(', ').replace(/_/g, ' ').toLowerCase()}`);
		else return true;
	}
}
