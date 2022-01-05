import {Inhibitor, InhibitorOptions} from './Inhibitor';
import {CommandContext} from '../lib/structures/contexts/CommandContext';
import {ComponentContext} from '../lib/structures/contexts/ComponentContext';
import {Snowflake} from 'discord.js';

export interface UserRolesOptions extends InhibitorOptions {
	ids: Array<Snowflake>;
	requireAll: boolean;
}

export class UserRoles extends Inhibitor {
	public readonly ids: Array<Snowflake>;
	public readonly requireAll: boolean = true;

	constructor(options: UserRolesOptions) {
		super(options);
		this.ids = options.ids;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inCachedGuild()) return;

		if (!ctx.member.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](...this.ids)) return ctx.reply({ 
			content: 'You do not have the required roles to execute this command',
			ephemeral: this.ephemeral,
		});
		else return true;
	}
}
