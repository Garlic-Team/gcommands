import type { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';

export interface PluginOptions {
	name: string;
	afterInitialization?: (client: GClient) => any;
	beforeLogin?: (client: GClient) => any;
	afterLogin?: (client: GClient) => any;
}

export class Plugin {
	public name: string;
	public afterInitialization: (client: GClient) => any;
	public beforeLogin: (client: GClient) => any;
	public afterLogin: (client: GClient) => any;

	public constructor(options: PluginOptions) {
		this.name = options.name;
		this.afterInitialization = options.afterInitialization;
		this.beforeLogin = options.beforeLogin;
		this.afterLogin = options.afterLogin;

		Plugins.register(this);
	}
}
