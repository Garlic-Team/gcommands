import type { Snowflake } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface ClientRolesOptions extends InhibitorOptions {
	ids?: Array<Snowflake>;
	getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
	requireAll?: boolean;
}

export class ClientRoles extends Inhibitor {
	public ids?: Array<Snowflake>;
	public readonly requireAll?: boolean = true;
	public getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	constructor(options: ClientRolesOptions) {
		super(options);

		this.ids = options.ids;
		this.getIds = options.getIds;
		this.requireAll = options.requireAll;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inCachedGuild()) return;

		const dynamicRoles = this.getIds?.(ctx);
		if (dynamicRoles) this.ids = dynamicRoles;

		if (
			!ctx.guild.members.me.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](
				...this.ids,
			)
		) {
			return ctx.reply({
				content:
					this.resolveMessage(ctx) ||
					'You do not have the required roles to execute this command',
				ephemeral: this.ephemeral,
			});
		} else {
			return true;
		}
	}
}
