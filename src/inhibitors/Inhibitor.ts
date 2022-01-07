import { CommandContext } from '../lib/structures/contexts/CommandContext';
import { ComponentContext } from '../lib/structures/contexts/ComponentContext';

export interface InhibitorOptions {
	message?: string | ((ctx: CommandContext | ComponentContext) => string);
	ephemeral?: boolean;
}

export class Inhibitor {
	protected readonly message: string | ((ctx: CommandContext | ComponentContext) => string);
	protected readonly ephemeral: boolean = true;

	constructor(options: InhibitorOptions = {}) {
		this.message = options.message;
	}

	protected resolveMessage(ctx: CommandContext | ComponentContext): string | void {
		if (typeof this.message === 'function') return this.message(ctx);
		else if (typeof this.message === 'string') return this.message;
	}
}
