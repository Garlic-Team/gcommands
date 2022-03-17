import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import type { Snowflake } from 'discord.js';

export interface MemberRolesOptions extends InhibitorOptions {
	ids?: Array<Snowflake>;

	getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	requireAll?: boolean;
}

const DEFAULT_MESSAGE = 'You do not have the required roles to execute this command';

export class MemberRoles extends Inhibitor {
	public ids?: Array<Snowflake>;
	public readonly requireAll?: boolean = true;

	public getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	constructor(options: MemberRolesOptions) {
		super(options);

		this.ids = options.ids;
		this.getIds = options.getIds;
		this.requireAll = options.requireAll;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inCachedGuild()) return;

		const dynamicRoles = this.getIds?.(ctx);
		if (dynamicRoles) this.ids = dynamicRoles;

		if (!ctx.member.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](...this.ids))
			return this.error(this.resolveMessage(ctx, DEFAULT_MESSAGE));
		else return this.ok();
	}
}
