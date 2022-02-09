import { Collection } from 'discord.js';
import { Component } from '../structures/Component';
import type { GClient } from '../GClient';
import Logger from 'js-logger';
import { Plugins } from './PluginManager';

export class ComponentManager extends Collection<string, Component> {
	private client: GClient;

	public register(component: Component): ComponentManager {
		if (component instanceof Component) {
			if (this.has(component.name) && !this.get(component.name)?.reloading)
				Logger.warn('Overwriting component', component.name);
			if (this.client) component.initialize(this.client);
			if (Plugins.currentlyLoading) component.owner = Plugins.currentlyLoading;
			this.set(component.name, component);
			Logger.debug('Registered component', component.name, component.owner ? `(by plugin ${component.owner})` : '');
		} else Logger.warn('Component must be a instance of Component');

		return this;
	}

	public unregister(componentName: string): Component | undefined {
		const component = this.get(componentName);
		if (component) {
			this.delete(componentName);
			Logger.debug('Unregistered component', component.name);
		}

		return component;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach(component => component.initialize(client));
	}
}

export const Components = new ComponentManager();
