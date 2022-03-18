import { Collection } from 'discord.js';
import { Plugin } from '../structures/Plugin';
import { Events, Logger } from '../util/logger/Logger';
import { container } from '../structures/Container';

export enum PluginHookType {
	AfterInitialization = 'afterInitialization',
	BeforeLogin = 'beforeLogin',
	AfterLogin = 'afterLogin',
}

export class PluginManager extends Collection<string, Plugin> {
	public register(plugin: any): PluginManager {
		if (plugin instanceof Plugin) {
			if (this.has(plugin.name)) Logger.warn('Overwriting plugin', plugin.name);
			this.set(plugin.name, plugin);
			Logger.emit(Events.PLUGIN_REGISTERED, plugin);
			Logger.debug('Registered plugin', plugin.name);
		} else Logger.warn('Plugin must be a instance of plugin');

		return this;
	}

	public async load(hookType: PluginHookType): Promise<void> {
		const plugins = this.filter((plugin) => typeof plugin[hookType] === 'function');

		for await (const plugin of plugins.values()) {
			await Promise.resolve(plugin[hookType](container.client)).catch((error) => {
				Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
		}
	}
}

export const Plugins = new PluginManager();
