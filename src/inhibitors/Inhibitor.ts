import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { err, ok } from '@sapphire/result';

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

	public ok() {
		return ok();
	}

	public error(error: { content: string; ephemeral: boolean }) {
		return err(error);
	}

	protected resolveMessage(
		ctx: CommandContext | ComponentContext,
		defaultMessage: string,
	): { content: string; ephemeral: boolean } {
		if (typeof this.message === 'function') return { content: this.message(ctx), ephemeral: this.ephemeral };
		else if (typeof this.message === 'string') return { content: this.message, ephemeral: this.ephemeral };
		else return { content: defaultMessage, ephemeral: this.ephemeral };
	}
}
