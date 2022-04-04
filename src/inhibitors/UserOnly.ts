import type { Snowflake } from 'discord.js';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { Err, Ok } from '@sapphire/result';

const DEFAULT_MESSAGE = 'You can not use this command';

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

	public run(ctx: CommandContext | ComponentContext): Ok<any> | Err<any> {
		const dynamicUsers = this.getIds?.(ctx);
		if (dynamicUsers) this.ids = dynamicUsers;

		if (!this.ids.includes(ctx.userId)) return this.error(this.resolveMessage(ctx, DEFAULT_MESSAGE));
		else return this.ok();
	}
}
