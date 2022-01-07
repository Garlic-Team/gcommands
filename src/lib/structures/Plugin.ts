import { GClient } from '../GClient';
import { Plugins } from '../managers/PluginManager';
import Logger from 'js-logger';
import { Util } from '../util/Util';

export class Plugin {
	public readonly name: string;
	public readonly run: (client: GClient) => any;

	public constructor(name: string, run: (client: GClient) => any) {
		this.name = name;
		this.run = run;

		Plugins.register(this);
	}

	public static validate(plugin: Plugin): boolean | void {
		const trace = Util.resolveValidationErrorTrace([plugin.name]);

		if (!plugin.name) return Logger.warn('Plugin must have a name', trace);
		else if (typeof plugin.name !== 'string') return Logger.warn('Plugin name must be a string', trace);
		else if (typeof plugin.run !== 'function') return Logger.warn('Plugin must have run a function', trace);
		else return true;
	}
}
