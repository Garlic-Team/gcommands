import { Inhibitor } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { confirm, ConfirmOptions } from '../util/confirm';

export class Confirm extends Inhibitor {
	public options?: ConfirmOptions;

	constructor(options?: ConfirmOptions) {
		super();
		this.options = options;
	}

	async run(ctx: CommandContext | ComponentContext) {
		return await confirm(ctx, this.options);
	}
}
