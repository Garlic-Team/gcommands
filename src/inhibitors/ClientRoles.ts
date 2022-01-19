import { Inhibitor, InhibitorOptions } from './Inhibitor';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Snowflake } from 'discord.js';

export interface ClientRolesOptions extends InhibitorOptions {
	ids: Array<Snowflake>;
	requireAll: boolean;
}

export class ClientRoles extends Inhibitor {
	public readonly ids: Array<Snowflake>;
	public readonly requireAll: boolean = true;

	constructor(options: ClientRolesOptions) {
		super(options);

		this.ids = options.ids;
		this.requireAll = options.requireAll;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inCachedGuild()) return;
		
		if (!ctx.guild.me.roles.cache[this.requireAll ? 'hasAll' : 'hasAny'](...this.ids))
			return ctx.reply({
				content: this.resolveMessage(ctx) || 'You do not have the required roles to execute this command',
				ephemeral: this.ephemeral,
			});
		else return true;
	}
}
