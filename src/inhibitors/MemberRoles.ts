import { Inhibitor, InhibitorOptions } from './Inhibitor';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Snowflake } from 'discord.js';

export interface MemberRolesOptions extends InhibitorOptions {
	ids?: Array<Snowflake>;
	getRoles?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
	requireAll?: boolean;
}

export class MemberRoles extends Inhibitor {
	public ids?: Array<Snowflake>;
	public readonly requireAll?: boolean = true;
	public getRoles?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	constructor(options: MemberRolesOptions) {
		super(options);

		this.ids = options.ids;
		this.getRoles = options.getRoles;
		this.requireAll = options.requireAll;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inCachedGuild()) return;

		const dynamicRoles = this.getRoles?.(ctx);
		if (dynamicRoles) this.ids = dynamicRoles;

		if (!ctx.member.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](...this.ids))
			return ctx.reply({
				content: this.resolveMessage(ctx) || 'You do not have the required roles to execute this command',
				ephemeral: this.ephemeral,
			});
		else return true;
	}
}
