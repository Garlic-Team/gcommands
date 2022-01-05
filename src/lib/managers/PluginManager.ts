import {Collection} from 'discord.js';
import {Plugin} from '../structures/Plugin';
import {GClient} from '../GClient';
import {PluginFinder} from '../loaders/PluginFinder';
import Logger from 'js-logger';

export class PluginManager extends Collection<string, Plugin> {
	private client: GClient;
	public currentlyLoading: string = null;

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

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		for await(const plugin of this.values()) {
			this.currentlyLoading = plugin.name;
			await Promise.resolve(plugin.run(client)).catch(error => {
				Logger.error(error.code, error.message);
				if (error.stack) Logger.trace(error.stack);
			}).then(() => {
				this.currentlyLoading = null;
			});
		}
	}
}

export const Plugins = new PluginManager();
