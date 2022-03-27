import { Collection } from 'discord.js';
import { Component } from '../structures/Component';
import { Events, Logger } from '../util/logger/Logger';
import { container } from '../structures/Container';

export class ComponentManager extends Collection<string, Component> {
	public register(component: Component): ComponentManager {
		if (component instanceof Component) {
			if (this.has(component.name) && !this.get(component.name)?.reloading)
				Logger.warn('Overwriting component', component.name);
			if (container.client) component.load();
			this.set(component.name, component);
			Logger.emit(Events.COMPONENT_REGISTERED, component);
			Logger.debug('Registered component', component.name);
		} else Logger.warn('Component must be a instance of Component');

		return this;
	}

	public unregister(componentName: string): Component | undefined {
		const component = this.get(componentName);
		if (component) {
			this.delete(componentName);
			Logger.emit(Events.COMPONENT_UNREGISTERED, component);
			Logger.debug('Unregistered component', component.name);
		}

		return component;
	}

	public load() {
		this.forEach((component) => component.load());
	}
}

export const Components = new ComponentManager();
