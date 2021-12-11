import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class ChannelOnly {
	public readonly channelId: string;

	constructor(channelId: string) {
		this.channelId = channelId;
	}

	run(ctx: CommandContext | ComponentContext) {
		return ctx.channelId === this.channelId;
	}
}
