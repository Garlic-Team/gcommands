import { AutoDeferType, GClient } from '../GClient';
import type { ComponentContext } from './contexts/ComponentContext';
import { Components } from '../managers/ComponentManager';
import Logger from 'js-logger';
import { Util } from '../util/Util';

export enum ComponentType {
	'BUTTON' = 1,
	'SELECT_MENU' = 2,
}

export type ComponentInhibitor = (ctx: ComponentContext) => boolean | any;
export type ComponentInhibitors = Array<{ run: ComponentInhibitor } | ComponentInhibitor>;

export interface ComponentOptions {
	name: string;
	type: Array<ComponentType | keyof typeof ComponentType>;
	inhibitors?: ComponentInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	fileName?: string;
	run?: (interaction: ComponentContext) => any;
	onError?: (interaction: ComponentContext, error: any) => any;
}

export class Component {
	public client: GClient;
	public readonly name: string;
	public readonly type: Array<ComponentType | keyof typeof ComponentType>;
	public readonly inhibitors: ComponentInhibitors = [];
	public guildId?: string;
	private static defaults: Partial<ComponentOptions>;
	public readonly cooldown?: string;
	public readonly fileName?: string;
	public readonly run: (ctx: ComponentContext) => any;
	public readonly onError?: (ctx: ComponentContext, error: any) => any;
	public owner?: string;
	public reloading = false;
	public readonly autoDefer?: AutoDeferType | keyof typeof AutoDeferType;

	public constructor(options: ComponentOptions) {
		Object.assign(this, Component.defaults);
		Object.assign(this, options);

		if (Array.isArray(this.type))
			this.type = this.type.map((type) =>
				typeof type === 'string' && Object.keys(ComponentType).includes(type) ? ComponentType[type] : type,
			);
		if (typeof this.autoDefer === 'string' && Object.keys(AutoDeferType).includes(this.autoDefer))
			this.autoDefer = AutoDeferType[this.autoDefer];

		if (this.validate()) Components.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
	}

	public unregister() {
		Components.unregister(this.name);
	}

	public async inhibit(ctx: ComponentContext): Promise<boolean> {
		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch((error) => {
					Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch((error) => {
					Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
					if (error.stack) Logger.trace(error.stack);
				});
			}
			if (result !== true) return false;
		}
		return true;
	}

	public async reload(): Promise<Component> {
		if (!this.fileName) return;

		this.reloading = true;

		delete require.cache[require.resolve(this.fileName)];
		await import(this.fileName);

		return Components.get(this.name);
	}

	public static setDefaults(defaults: Partial<ComponentOptions>): void {
		Component.defaults = defaults;
	}

	private validate(): boolean | void {
		const trace = Util.resolveValidationErrorTrace([this.name, this.fileName]);

		if (!this.name) return Logger.warn('Component must have a name', trace);
		else if (typeof this.name !== 'string') return Logger.warn('Component name must be a string', trace);
		else if (!Array.isArray(this.type) || !this.type.every((type) => Object.values(ComponentType).includes(type)))
			return Logger.warn('Component type must be a array of ComponentType', trace);
		else if (
			!this.inhibitors.every((inhibitor) => typeof inhibitor !== 'function' && typeof inhibitor?.run !== 'function')
		)
			return Logger.warn(
				'Component inhibitors must be a array of functions/object with run function or undefined',
				trace,
			);
		else if (this.guildId && typeof this.guildId !== 'string')
			return Logger.warn('Component guildId must be a string or undefined', trace);
		else if (this.cooldown && typeof this.cooldown !== 'string')
			return Logger.warn('Component cooldown must be a string or undefined', trace);
		else if (this.autoDefer && !Object.values(AutoDeferType).includes(this.autoDefer))
			return Logger.warn('Component autoDefer must be one of AutoDeferType or undefined', trace);
		else if (this.fileName && typeof this.fileName !== 'string')
			return Logger.warn('Component filePath must be a string or undefined', trace);
		else if (typeof this.run !== 'function') return Logger.warn('Component must have a run function', trace);
		else if (this.onError && typeof this.onError !== 'function')
			return Logger.warn('Component onError must be a function or undefined', trace);
		else return true;
	}
}
