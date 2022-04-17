import type { Snowflake } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface UserOnlyOptions extends InhibitorOptions {
	ids: Array<Snowflake>;
	getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
}

export class UserOnly extends Inhibitor {
	public ids: Array<Snowflake>;
	public getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	constructor(options: UserOnlyOptions) {
		super(options);
		this.ids = options.ids;
		this.getIds = options.getIds;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		const dynamicUsers = this.getIds?.(ctx);
		if (dynamicUsers) this.ids = dynamicUsers;

		if (!this.ids.includes(ctx.userId)) {
			return ctx.reply({
				content: this.resolveMessage(ctx) || 'You can not use this command',
				ephemeral: this.ephemeral,
			});
		} else {
			return true;
		}
	}
}
