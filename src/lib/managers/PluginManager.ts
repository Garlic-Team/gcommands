import {Collection} from 'discord.js';
import {Plugin} from '../structures/Plugin';
import {GClient} from '../GClient';
import {Events} from '../util/Events';
import {PluginFinder} from '../loaders/PluginFinder';

export enum PluginType {
	BEFORE_INITIALIZATION = 'beforeInitialization',
	BEFORE_LOGIN = 'beforeLogin',
	AFTER_LOGIN = 'afterLogin',
}

export class PluginManager extends Collection<string, Plugin> {
	private client: GClient;

	public register(plugin: any): PluginManager {
		if (plugin instanceof Plugin) {
			if (this.has(plugin.name) && this.client) this.client.emit(Events.WARN, `Overwriting plugin ${plugin.name}`);
			this.set(plugin.name, plugin);
		} else throw new TypeError('Plugin does not implement or extend the Plugin class');

		if (this.client) this.client.emit(Events.PLUGIN_REGISTER, plugin);

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
