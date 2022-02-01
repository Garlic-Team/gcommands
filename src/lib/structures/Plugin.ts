import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import Logger from 'js-logger';
import { z } from 'zod';

const validationSchema = z
	.object({
		name: z.string(),
		run: z.function(),
	})
	.passthrough();

export class Plugin {
	public name: string;
	public run: (client: GClient) => any;

	public constructor(name: string, run: (client: GClient) => any) {
		validationSchema
			.parseAsync({ name, run })
			.then((options) => {
				this.name = options.name;
				this.run = options.run;

				Plugins.register(this);
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}
}
