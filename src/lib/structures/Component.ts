import { AutoDeferType, GClient } from '../GClient';
import type { ComponentContext } from './contexts/ComponentContext';
import { Components } from '../managers/ComponentManager';
import { Logger } from '../util/logger/Logger';
import { z } from 'zod';
import { err, Err, fromAsync, isErr, ok, Ok } from '@sapphire/result';

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

const validationSchema = z
	.object({
		name: z
			.string()
			.max(32)
			.regex(/^[a-z1-9]/),
		type: z
			.union([z.string(), z.nativeEnum(ComponentType)])
			.transform((arg) =>
				typeof arg === 'string' && Object.keys(ComponentType).includes(arg) ? ComponentType[arg] : arg,
			)
			.array()
			.nonempty(),
		inhibitors: z.any().optional(),
		guildId: z.string().optional(),
		cooldown: z.string().optional(),
		autoDefer: z
			.union([z.string(), z.nativeEnum(AutoDeferType)])
			.transform((arg) =>
				typeof arg === 'string' && Object.keys(AutoDeferType).includes(arg) ? AutoDeferType[arg] : arg,
			)
			.optional(),
		fileName: z.string().optional(),
		run: z.function(),
		onError: z.function().optional(),
	})
	.passthrough();

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
		if (this.run) options.run = this.run;
		if (this.onError) options.onError = this.onError;

		validationSchema
			.parseAsync({ ...options, ...this })
			.then((options) => {
				this.name = options.name || Component.defaults?.name;
				this.type = options.type || Component.defaults?.type;
				this.inhibitors = options.inhibitors || Component.defaults?.inhibitors;
				this.guildId = options.guildId || Component.defaults?.guildId;
				this.cooldown = options.cooldown || Component.defaults?.cooldown;
				this.fileName = options.fileName || Component.defaults?.fileName;
				this.run = options.run || Component.defaults?.run;
				this.onError = options.onError || Component.defaults?.onError;
				this.autoDefer = options.autoDefer || Component.defaults?.autoDefer;

				Components.register(this);
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (!this.guildId && client.options?.devGuildId) this.guildId = client.options.devGuildId;
	}

	public unregister() {
		Components.unregister(this.name);
	}

	public async inhibit(ctx: ComponentContext): Promise<Err<any> | Ok<any>> {
		if (!this.inhibitors) return ok();

		for await (const inhibitor of this.inhibitors) {
			let result;
			if (typeof inhibitor === 'function') {
				result = await fromAsync(async () => inhibitor(ctx));
			} else if (typeof inhibitor.run === 'function') {
				result = await fromAsync(async () => inhibitor.run(ctx));
			}
			if (isErr(result)) {
				Logger.error(result.error);
			} else if (isErr(result.value) && 'content' in result.value.error) {
				await ctx.safeReply(result.value.error);
				return err();
			}
		}
		return ok();
	}

	public async reload(): Promise<Component> {
		if (!this.fileName) return;

		this.reloading = true;

		delete require.cache[require.resolve(this.fileName)];
		await import(this.fileName);

		return Components.get(this.name);
	}

	public static setDefaults(defaults: Partial<ComponentOptions>): void {
		validationSchema
			.partial()
			.parseAsync(defaults)
			.then((defaults) => {
				Component.defaults = defaults as Partial<ComponentOptions>;
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}
}
