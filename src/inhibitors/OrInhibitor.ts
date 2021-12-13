import {BaseContext} from '../lib/structures/BaseContext';

export type BaseInhibitor =
	((ctx: BaseContext) => (boolean | void | Promise<boolean> | Promise<void>))
	| { run: (ctx: BaseContext) => (boolean | void | Promise<boolean> | Promise<void>) };

export class OrInhibitor {
	public readonly inhibitor1: BaseInhibitor;
	public readonly inhibitor2: BaseInhibitor;

	constructor(inhibitor1: BaseInhibitor, inhibitor2: BaseInhibitor) {
		this.inhibitor1 = inhibitor1;
		this.inhibitor2 = inhibitor2;
	}

	async run(ctx: BaseContext): Promise<void | boolean> {
		let value1: boolean | void;
		let value2: boolean | void;

		if (typeof this.inhibitor1 === 'function') value1 = await this.inhibitor1(ctx);
		else if (typeof this.inhibitor1?.run === 'function') value1 = await this.inhibitor1.run(ctx);

		if (typeof this.inhibitor2 === 'function') value2 = await this.inhibitor2(ctx);
		else if (typeof this.inhibitor2?.run === 'function') value2 = await this.inhibitor2.run(ctx);

		return value1 || value2;
	}
}
