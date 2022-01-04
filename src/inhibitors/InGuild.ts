import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { Inhibitor } from './Inhibitor';

export class InGuild extends Inhibitor {
	public run(ctx: CommandContext | ComponentContext): boolean | any {
		if (!ctx.inGuild()) return ctx.reply(this.resolveMessage(ctx) || 'This command can only be used inside a guild');
		else return true;
	}
}