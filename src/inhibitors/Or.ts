import {Inhibitor, InhibitorOptions} from './Inhibitor';
import {CommandContext} from '../lib/structures/contexts/CommandContext';
import {ComponentContext} from '../lib/structures/contexts/ComponentContext';

type InhibitorFunction = (ctx: CommandContext | ComponentContext) => boolean | any;

export interface OrOptions extends InhibitorOptions {
	inhibitors: Array<{ run: InhibitorFunction } | InhibitorFunction>;
}

export class Or extends Inhibitor {
	public readonly inhibitors: Array<{ run: InhibitorFunction } | InhibitorFunction>;

	constructor(options: OrOptions) {
		super(options);
		this.inhibitors = options.inhibitors;
	}

	async run(ctx: CommandContext | ComponentContext) {
		const results = [];

		for await(const inhibitor of this.inhibitors) {
			if (typeof inhibitor === 'function') results.push(!!await inhibitor(ctx));
			if (typeof inhibitor === 'object' && typeof inhibitor?.run === 'function') results.push(!!await inhibitor.run(ctx));
		}

		return results.includes(true);
	}
}
