import {Collection} from 'discord.js';
import {Component} from '../structures/Component';
import {GClient} from '../GClient';
import Logger from 'js-logger';

export class ComponentManager extends Collection<string, Component> {
	private client: GClient;

	public register(component: Component): ComponentManager {
		if (component instanceof Component) {
			if (this.has(component.name) && !this.get(component.name)?.reloading) Logger.warn('Overwriting component', component.name);
			if (!Component.validate(component)) return;
			if (this.client) component.initialize(this.client);
			this.set(component.name, component);
			Logger.debug('Registered component', component.name);
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
