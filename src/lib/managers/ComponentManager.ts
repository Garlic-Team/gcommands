import {Collection} from 'discord.js';
import {Component} from '../structures/Component';
import {GClient} from '../GClient';
import {Events} from '../util/Events';

export class ComponentManager extends Collection<string, Component> {
	private client: GClient;

	public register(component: Component): ComponentManager {
		if (component instanceof Component) {
			if (this.client) component.initialize(this.client);
			if (this.has(component.name) && this.client) this.client.emit(Events.WARN, `Overwriting component ${component.name}`);
			this.set(component.name, component);
		} else throw new TypeError('Component does not implement or extend the Component class');

		if (this.client) this.client.emit(Events.COMPONENT_REGISTER, component);

		return this;
	}

	public unregister(componentName: string): Component | undefined {
		const component = this.get(componentName);
		if (component) {
			this.delete(componentName);
			this.client.emit(Events.COMPONENT_REGISTER, component);
		}

		return component;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach(component => component.initialize(client));
	}
}
