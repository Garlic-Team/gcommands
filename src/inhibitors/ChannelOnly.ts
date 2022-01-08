import { Snowflake } from 'discord.js';
import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor, InhibitorOptions } from './Inhibitor';

export interface ChannelOnlyOptions extends InhibitorOptions {
	ids: Array<Snowflake>;
}

export class ChannelOnly extends Inhibitor {
	public readonly ids: Array<Snowflake>;

	constructor(options: ChannelOnlyOptions) {
		super(options);
		this.ids = options.ids;
	}

	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!this.ids.includes(ctx.channelId))
			return ctx.reply({
				content: this.resolveMessage(ctx) || 'This command can not be used in this channel',
				ephemeral: this.ephemeral,
			});
		else return true;
	}
}
