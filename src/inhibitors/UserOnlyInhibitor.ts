import {CommandContext} from '../lib/structures/CommandContext';
import {ComponentContext} from '../lib/structures/ComponentContext';

export class UserOnlyInhibitor {
	public readonly userId: string;

	constructor(userId: string) {
		this.userId = userId;
	}

	run(ctx: CommandContext | ComponentContext) {
		return ctx.userId === this.userId;
	}
}
