import type { GClient } from '../GClient';
import type { ClientEvents, WSEventType } from 'discord.js';
import { Listeners } from '../managers/ListenerManager';
import { Logger } from '../util/logger/Logger';
import { z } from 'zod';

export interface ListenerOptions<WS extends boolean, Event extends WS extends true ? WSEventType : keyof ClientEvents> {
	event: Event | string;
	name: string;
	once?: boolean;
	ws?: WS;
	fileName?: string;
	run?: (...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<any>) => any;
}

const validationSchema = z
	.object({
		event: z.string(),
		name: z.string(),
		once: z.boolean().optional(),
		ws: z.boolean().optional().default(false),
		fileName: z.string().optional(),
		run: z.function(),
	})
	.passthrough();
export class Listener<
	WS extends boolean = boolean,
	Event extends WS extends true ? WSEventType : keyof ClientEvents = WS extends true ? WSEventType : keyof ClientEvents,
> {
	public client: GClient;
	public event: Event | string;
	public name: string;
	public once?: boolean;
	public ws?: WS;
	public fileName?: string;
	public run: (...args: Array<any>) => any;
	public owner?: string;
	public reloading = false;

	public constructor(options: ListenerOptions<WS, Event>) {
		validationSchema
			.parseAsync(options)
			.then((options) => {
				this.event = options.event;
				this.name = options.name;
				this.once = options.once;
				this.ws = options.ws as WS;
				this.fileName = options.fileName;
				this.run = options.run;

				Listeners.register(this);
			})
			.catch((error) => {
				Logger.warn(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (this.ws) client.ws[this.once ? 'once' : 'on'](this.event as WSEventType, this._run.bind(this));
		else client[this.once ? 'once' : 'on'](this.event as keyof ClientEvents, this._run.bind(this));
	}

	public unregister(): void {
		Listeners.unregister(this.name);
	}

	public async _run(...args: Array<any>): Promise<void> {
		await Promise.resolve(this.run.call(this, ...args)).catch((error) => {
			Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
			if (error.stack) Logger.trace(error.stack);
		});
	}

	public async reload(): Promise<Listener> {
		if (!this.fileName) return;

		this.reloading = true;

		delete require.cache[require.resolve(this.fileName)];
		await import(this.fileName);

		return Listeners.get(this.name);
	}
}
