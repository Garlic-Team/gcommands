import { PermissionResolvable } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface ClientPermissionsOptions extends InhibitorOptions {
	permissions: Array<PermissionResolvable>;
}

export class ClientPermissions extends Inhibitor {
	public readonly permissions: Array<PermissionResolvable>;

	constructor(options: ClientPermissionsOptions) {
		super(options);
		this.permissions = options.permissions;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild()) return;
		if (!ctx.guild.me.permissions.has(this.permissions))
			return ctx.reply({
				content:
					this.resolveMessage(ctx) ||
					`I need the following permissions to execute this command: ${this.permissions
						.join(', ')
						.replace(/_/g, ' ')
						.toLowerCase()}`,
				ephemeral: this.ephemeral,
			});
		else return true;
	}
}
