import { Inhibitor } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { ChannelType } from 'discord.js';

export class Nsfw extends Inhibitor {
	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild() || ctx.channel.type !== ChannelType.GuildText) return;

		if (!ctx.channel.nsfw) {
			return ctx.reply({
				content:
					this.resolveMessage(ctx) ||
					'This command can only be used inside a nsfw channel',
				ephemeral: this.ephemeral,
			});
		} else {
			return true;
		}
	}
}
