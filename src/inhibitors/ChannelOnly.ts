import type { Snowflake } from 'discord.js';
import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface ChannelOnlyOptions extends InhibitorOptions {
	ids?: Array<Snowflake>;
	getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;
}

export class ChannelOnly extends Inhibitor {
	public ids?: Array<Snowflake>;
	public getIds?(ctx: CommandContext | ComponentContext): Array<Snowflake>;

	constructor(options: ChannelOnlyOptions) {
		super(options);

		this.ids = options.ids;
		this.getIds = options.getIds;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		const dynamicChannels = this.getIds?.(ctx);
		if (dynamicChannels) this.ids = dynamicChannels;

		if (!this.ids.includes(ctx.channelId)) {
			return ctx.reply({
				content:
					this.resolveMessage(ctx) ||
					'This command can not be used in this channel',
				ephemeral: this.ephemeral,
			});
		} else {
			return true;
		}
	}
}
