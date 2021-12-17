import {AutoDeferType, GClient} from '../GClient';
import {ComponentContext} from './ComponentContext';
import {Components} from '../managers/ComponentManager';
import Logger from 'js-logger';

export enum ComponentType {
	BUTTON = 'BUTTON',
	SELECT_MENU = 'SELECT_MENU',
}

export type ComponentInhibitor = (ctx: ComponentContext) => (boolean | void | Promise<boolean> | Promise<void>);
export type ComponentInhibitors = Array<{ run: ComponentInhibitor } | ComponentInhibitor>;

export interface ComponentOptions {
	type: Array<ComponentType>;
	inhibitors?: ComponentInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType;
	run?: (interaction: ComponentContext) => any;
	onError?: (interaction: ComponentContext, error: any) => any;
}

export class Component {
	public client: GClient;
	public readonly name: string;
	public readonly type: Array<ComponentType>;
	public readonly inhibitors: ComponentInhibitors = [];
	public guildId?: string;
	public cooldown?: string;
	public autoDefer?: AutoDeferType;
	public readonly run: (ctx: ComponentContext) => any;
	public readonly onError?: (ctx: ComponentContext, error: any) => any;

	public constructor(name: string, options: ComponentOptions) {
		this.name = name;
		Object.assign(this, options);

		Components.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
		if (!this.cooldown && client.options?.cooldown) this.cooldown = client.options.cooldown;
		if (!this.autoDefer && client.options?.autoDefer) this.autoDefer = client.options.autoDefer;
	}

	public static validate(component: Component): boolean | void {
		if (!component.name) return Logger.warn('Component must have a name');
		else if (typeof component.name !== 'string') return Logger.warn('Component name must be a string');
		else if (typeof component.run !== 'function') return Logger.warn('Component', component.name, 'must have a run function');
		else return true;
	}

	public unregister() {
		Components.unregister(this.name);
	}

	public async inhibit(ctx: ComponentContext): Promise<boolean> {
		for await(const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch(error => {
					Logger.error(error.code, error.message);
					Logger.trace(error.trace);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(error.code, error.message);
					Logger.trace(error.trace);
				});
			}
			if (result !== true) return false;
		}
		return true;
	}
}
