import type { Snowflake } from 'discord.js';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor, InhibitorOptions } from './Inhibitor';

export interface UserOnlyOptions extends InhibitorOptions {
	ids: Array<Snowflake>;
}

export class UserOnly extends Inhibitor {
	public readonly ids: Array<Snowflake>;

	constructor(options: UserOnlyOptions) {
		super(options);
		this.ids = options.ids;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!this.ids.includes(ctx.userId))
			return ctx.reply({
				content: this.resolveMessage(ctx) || 'You can not use this command',
				ephemeral: this.ephemeral,
			});
		else return true;
	}
}
