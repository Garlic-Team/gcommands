import {GClient} from '../GClient';
import {ComponentContext} from './ComponentContext';
import {Events} from '../util/Events';

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
	public readonly run: (ctx: ComponentContext) => any;
	public readonly onError?: (ctx: ComponentContext, error: any) => any;

	public constructor(name: string, options: ComponentOptions) {
		Component.validate(name, options, this.run);

		this.name = name;
		Object.assign(this, options);

		GClient.gcomponents.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
		if (!this.cooldown && client.options?.cooldown) this.cooldown = client.options.cooldown;
	}

	public unregister() {
		GClient.gcomponents.unregister(this.name);
	}

	public async inhibit(ctx: ComponentContext): Promise<boolean> {
		for await(const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch(error => this.client.emit(Events.ERROR, error));
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => this.client.emit(Events.ERROR, error));
			}
			if (result !== true) return false;
		}
		return true;
	}

	private static validate(name: string, options: ComponentOptions, run: (ctx: ComponentContext) => any) {
		if (!name) throw new TypeError('Component must have a name');
		if (typeof name !== 'string') throw new TypeError('Component name must be a string');
		if (!options.type) throw new TypeError('Component must have a type');
		if (!options.type.every(type => ComponentType[type])) throw new TypeError('Component type must be one of ComponentType');
		if (typeof options.run !== 'function' && typeof run !== 'function') throw new TypeError('Component must have a run function');
	}
}
