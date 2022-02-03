import { Collection } from 'discord.js';
import { Component } from '../structures/Component';
import Logger from 'js-logger';
import { Plugins } from './PluginManager';

export class ComponentManager extends Collection<string, Component> {
	public register(component: Component): ComponentManager {
		if (component instanceof Component) {
			if (this.has(component.name) && !this.get(component.name)?.reloading)
				Logger.warn('Overwriting component', component.name);
			if (Plugins.currentlyLoading) component.owner = Plugins.currentlyLoading;
			this.set(component.name, component);
			Logger.debug('Registered component', component.name, component.owner ? `(by plugin ${component.owner})` : '');
		} else Logger.warn('Component must be a instance of Component');

		return this;
	}
}

export const Components = new ComponentManager();
