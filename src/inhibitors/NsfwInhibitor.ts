import {Context} from '../lib/structures/contexts/Context';

export class NsfwInhibitor {
	run(ctx: Context): boolean {
		return !!(ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw);
	}
}
