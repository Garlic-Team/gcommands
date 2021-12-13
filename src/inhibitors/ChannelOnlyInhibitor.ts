import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class ChannelOnlyInhibitor {
	public readonly channelId: string;

	constructor(channelId: string) {
		this.channelId = channelId;
	}

	run(ctx: CommandContext | ComponentContext): boolean {
		return ctx.channelId === this.channelId;
	}
}
