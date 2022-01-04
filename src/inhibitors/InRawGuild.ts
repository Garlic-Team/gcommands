import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor } from './Inhibitor';

export class InRawGuild extends Inhibitor {
	public run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inRawGuild()) return ctx.reply(this.resolveMessage(ctx) || 'This command is not available right now');
		else return true;
	}
}