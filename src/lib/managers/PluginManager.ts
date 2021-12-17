import {Collection} from 'discord.js';
import {Plugin} from '../structures/Plugin';
import {GClient} from '../GClient';
import {PluginFinder} from '../loaders/PluginFinder';
import Logger from 'js-logger';

export enum PluginType {
	BEFORE_INITIALIZATION = 'beforeInitialization',
	BEFORE_LOGIN = 'beforeLogin',
	AFTER_LOGIN = 'afterLogin',
}

export class PluginManager extends Collection<string, Plugin> {
	private client: GClient;

	public register(plugin: any): PluginManager {
		if (plugin instanceof Plugin) {
			if (this.has(plugin.name)) Logger.warn('Overwriting plugin', plugin.name);
			if (!Plugin.validate(plugin)) return;
			this.set(plugin.name, plugin);
			Logger.debug('Registered plugin', plugin.name);
		} else Logger.warn('Plugin must be a instance of plugin');

		return this;
	}

	public async search(basedir: string): Promise<void> {
		await PluginFinder(basedir);
	}

	public async load(type: PluginType): Promise<void> {
		const plugins = this.filter(plugin => typeof plugin[type] === 'function');
		for await(const plugin of plugins.values()) {
			await plugin[type](this.client);
		}
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
	}
}

export const Plugins = new PluginManager();
