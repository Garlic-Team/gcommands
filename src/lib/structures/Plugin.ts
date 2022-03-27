import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import { Logger } from '../util/logger/Logger';
import { z } from 'zod';

export interface PluginOptions {
	name: string;
	afterInitialization?: (client: GClient) => any;
	beforeLogin?: (client: GClient) => any;
	afterLogin?: (client: GClient) => any;
}

const validationSchema = z
	.object({
		name: z.string(),
		afterInitialization: z.function().optional(),
		beforeLogin: z.function().optional(),
		afterLogin: z.function().optional(),
	})
	.passthrough();

export class Plugin {
	public name: string;
	public afterInitialization: (client: GClient) => any;
	public beforeLogin: (client: GClient) => any;
	public afterLogin: (client: GClient) => any;

	public constructor(options: PluginOptions) {
		validationSchema
			.parseAsync({ ...options, ...this })
			.then((options) => {
				this.name = options.name;
				this.afterInitialization = options.afterInitialization;
				this.beforeLogin = options.beforeLogin;
				this.afterLogin = options.afterLogin;

				Plugins.register(this);
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}
}
