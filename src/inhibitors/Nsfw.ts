import {Inhibitor} from './Inhibitor';
import {CommandContext} from '../lib/structures/contexts/CommandContext';
import {ComponentContext} from '../lib/structures/contexts/ComponentContext';

export class Nsfw extends Inhibitor {
	run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild() || ctx.channel.type !== 'GUILD_TEXT') return;

		if (!ctx.channel.nsfw) return ctx.reply(this.resolveMessage(ctx) || 'This command can only be used inside a nsfw channel');
		else return true;
	}
}
