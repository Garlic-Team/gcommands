import {BaseContext} from '../lib/structures/BaseContext';

export class NsfwInhibitor {
	run(ctx: BaseContext): boolean {
		return !!(ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw);
	}
}
