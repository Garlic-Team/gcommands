import { s } from '@sapphire/shapeshift';
import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import { Logger } from '../util/logger/Logger';

const parser = s.object({
	name: s.string,
	run: s.any,
});

export class Plugin {
	public name: string;
	public run: (client: GClient) => any;

	public constructor(name: string, run: (client: GClient) => any) {
		try {
			const parsed = parser.passthrough.parse({ name, run, ...this });
			this.name = parsed.name;
			this.run = parsed.run;

			Plugins.register(this);
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
	}
}
