import {AutoDeferType, GClient} from '../GClient';
import {ComponentContext} from './ComponentContext';
import {Components} from '../managers/ComponentManager';
import Logger from 'js-logger';
import {Util} from '../util/Util';

export enum ComponentType {
	'BUTTON' = 1,
	'SELECT_MENU' = 2,
}

export type ComponentInhibitor = (ctx: ComponentContext) => (boolean | void | Promise<boolean> | Promise<void>);
export type ComponentInhibitors = Array<{ run: ComponentInhibitor } | ComponentInhibitor>;

export interface ComponentOptions {
	name: string;
	type: Array<ComponentType | keyof typeof ComponentType>;
	inhibitors?: ComponentInhibitors;
	guildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType | keyof typeof ComponentType;
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
	public cooldown?: string;
	public autoDefer?: AutoDeferType | keyof typeof AutoDeferType;
	public readonly fileName?: string;
	public readonly run: (ctx: ComponentContext) => any;
	public readonly onError?: (ctx: ComponentContext, error: any) => any;
	public owner?: string;
	public reloading = false;

	public constructor(options: ComponentOptions) {
		Object.assign(this, options);

		if (Array.isArray(this.type)) this.type = this.type.map(type => typeof type === 'string' && Object.keys(ComponentType).includes(type) ? ComponentType[type] : type);
		if (typeof this.autoDefer === 'string' && Object.keys(AutoDeferType).includes(this.autoDefer)) this.autoDefer = AutoDeferType[this.autoDefer];

		Components.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
		if (!this.cooldown && client.options?.cooldown) this.cooldown = client.options.cooldown;
		if (!this.autoDefer && client.options?.autoDefer) this.autoDefer = client.options.autoDefer;
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
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(error.code, error.message);
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

	public static validate(component: Component): boolean | void {
		const trace = Util.resolveValidationErrorTrace([
			component.name,
			component.fileName,
		]);

		if (!component.name) return Logger.warn('Component must have a name', trace);
		else if (typeof component.name !== 'string') return Logger.warn('Component name must be a string', trace);
		else if (!Array.isArray(component.type) || !component.type.every(type => Object.values(ComponentType).includes(type))) return Logger.warn('Component type must be a array of ComponentType', trace);
		else if (!component.inhibitors.every(inhibitor => typeof inhibitor !== 'function' && typeof inhibitor?.run !== 'function')) return Logger.warn('Component inhibitors must be a array of functions/object with run function or undefined', trace);
		else if (component.guildId && typeof component.guildId !== 'string') return Logger.warn('Component guildId must be a string or undefined', trace);
		else if (component.cooldown && typeof component.cooldown !== 'string') return Logger.warn('Component cooldown must be a string or undefined', trace);
		else if (component.autoDefer && !Object.values(AutoDeferType).includes(component.autoDefer)) return Logger.warn('Component autoDefer must be one of AutoDeferType or undefined', trace);
		else if (component.fileName && typeof component.fileName !== 'string') return Logger.warn('Component filePath must be a string or undefined', trace);
		else if (typeof component.run !== 'function') return Logger.warn('Component must have a run function', trace);
		else if (component.onError && typeof component.onError !== 'function') return Logger.warn('Component onError must be a function or undefined', trace);
		else return true;
	}
}
