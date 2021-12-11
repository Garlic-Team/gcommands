import {GClient} from '../GClient';

export interface PluginOptions {
	beforeInitialization?: (client: GClient) => any;
	beforeLogin?: (client: GClient) => any;
	afterLogin?: (client: GClient) => any;
}

export class Plugin {
	public readonly name: string;
	public readonly beforeInitialization?: (client: GClient) => any;
	public readonly beforeLogin?: (client: GClient) => any;
	public readonly afterLogin?: (client: GClient) => any;

	public constructor(name: string, options: PluginOptions) {
		Plugin.validate(name, options);

		this.name = name;
		Object.assign(this, options);

		GClient.gplugins.register(this);
	}

	private static validate(name: string, options: PluginOptions): void {
		if (!name) throw new TypeError('Plugin must have a name');
		if (typeof name !== 'string') throw new TypeError('Plugin name must be a string');
		if (typeof options.beforeInitialization !== 'function' && typeof options.beforeLogin !== 'function' && typeof options.afterLogin !== 'function') throw new TypeError('Plugin must provide a function');
	}
}
