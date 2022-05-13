import type { ComponentContext } from './contexts/ComponentContext';
import { AutoDeferType, GClient } from '../GClient';
import { Components } from '../managers/ComponentManager';
import { Logger } from '../util/logger/Logger';
import { s } from '@sapphire/shapeshift';
import { commandAndOptionNameRegexp } from '../util/regexes';

export enum ComponentType {
	'BUTTON' = 1,
	'SELECT_MENU' = 2,
}

export type ComponentInhibitor = (ctx: ComponentContext) => boolean | any;
export type ComponentInhibitors = Array<
	{ run: ComponentInhibitor } | ComponentInhibitor
>;

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

const parser = s.object({
	name: s.string.lengthLessThanOrEqual(32).regex(commandAndOptionNameRegexp),
	type: s.union(s.string, s.nativeEnum(ComponentType)).transform(value => {
		return typeof value === 'string' &&
			Object.keys(ComponentType).includes(value)
			? ComponentType[value]
			: value;
	}),
	inhibitors: s.array(s.any).optional,
	guildId: s.string.optional,
	cooldown: s.string.optional,
	autoDefer: s.union(s.string, s.nativeEnum(AutoDeferType)).transform(value => {
		return typeof value === 'string' &&
			Object.keys(AutoDeferType).includes(value)
			? AutoDeferType[value]
			: value;
	}),
	fileName: s.string.optional,
	run: s.any,
	onError: s.any,
});

export class Component {
	public client: GClient;
	public name: string;
	public type: Array<ComponentType | keyof typeof ComponentType>;
	public inhibitors: ComponentInhibitors = [];
	public guildId?: string;
	private static defaults: Partial<ComponentOptions>;
	public cooldown?: string;
	public fileName?: string;
	public run: (ctx: ComponentContext) => any;
	public onError?: (ctx: ComponentContext, error: any) => any;
	public owner?: string;
	public reloading = false;
	public autoDefer?: AutoDeferType | keyof typeof AutoDeferType;

	public constructor(options: ComponentOptions) {
		try {
			const parsed = parser.passthrough.parse({ ...options, ...this });
			this.name = parsed.name || Component.defaults?.name;
			this.type = parsed.type || Component.defaults?.type;
			this.inhibitors = parsed.inhibitors || Component.defaults?.inhibitors;
			this.guildId = parsed.guildId || Component.defaults?.guildId;
			this.cooldown = parsed.cooldown || Component.defaults?.cooldown;
			this.fileName = parsed.fileName || Component.defaults?.fileName;
			this.run = parsed.run || Component.defaults?.run;
			this.onError = parsed.onError || Component.defaults?.onError;
			this.autoDefer = parsed.autoDefer || Component.defaults?.autoDefer;

			Components.register(this);
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId)
			this.guildId = client.options.devGuildId;
	}

	public unregister(): Component | undefined {
		return Components.unregister(this.name);
	}

	public async inhibit(ctx: ComponentContext): Promise<boolean> {
		if (!this.inhibitors) return true;

		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await Promise.resolve(inhibitor(ctx)).catch(error => {
					Logger.error(
						typeof error.code !== 'undefined' ? error.code : '',
						error.message,
					);
					if (error.stack) Logger.trace(error.stack);
				});
			} else if (typeof inhibitor.run === 'function') {
				result = await Promise.resolve(inhibitor.run(ctx)).catch(error => {
					Logger.error(
						typeof error.code !== 'undefined' ? error.code : '',
						error.message,
					);
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
		try {
			Component.defaults = parser.partial.passthrough.parse(defaults);
		} catch (error) {
			Logger.warn(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		}
	}
}
