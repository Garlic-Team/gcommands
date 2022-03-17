import { Inhibitor, InhibitorOptions } from './Inhibitor';
import type { CommandContext } from '../lib/structures/contexts/CommandContext';
import type { ComponentContext } from '../lib/structures/contexts/ComponentContext';
import { fromAsync, isErr } from '@sapphire/result';
import { Logger } from '../lib/util/logger/Logger';

type InhibitorFunction = (ctx: CommandContext | ComponentContext) => boolean | any;

export interface OrOptions extends InhibitorOptions {
	inhibitors: Array<{ run: InhibitorFunction } | InhibitorFunction>;
}

const DEFAULT_MESSAGE = 'You can not run this command for several reasons';

export class Or extends Inhibitor {
	public readonly inhibitors: Array<{ run: InhibitorFunction } | InhibitorFunction>;

	constructor(options: OrOptions) {
		super(options);
		this.inhibitors = options.inhibitors;
	}

	async run(ctx: CommandContext | ComponentContext) {
		const results = [];

		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await fromAsync(async () => inhibitor(ctx));
			} else if (typeof inhibitor.run === 'function') {
				result = await fromAsync(async () => inhibitor.run(ctx));
			}
			if (isErr(result)) {
				Logger.error(result.error);
			} else {
				results.push(result.value);
			}
		}

		if (results.map((value) => isErr(value)).every((value) => value === true))
			return this.error(this.resolveMessage(ctx, DEFAULT_MESSAGE));

		return this.ok();
	}
}
