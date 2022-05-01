import { z } from 'zod';
import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import { Logger } from '../util/logger/Logger';

const validationSchema = z
	.object({
		name: z.string(),
		run: z.function(),
	})
	.passthrough();

export class Plugin {
	public name: string;
	public run: (client: GClient) => any;
	public options: Object;

	public constructor(name: string, run: (client: GClient) => any) {
		validationSchema
			.parseAsync({ name, run, ...this })
			.then(options => {
				this.name = options.name;
				this.run = options.run;
				this.options = options;

				Plugins.register(this);
			})
			.catch(error => {
				Logger.warn(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
	}
}
