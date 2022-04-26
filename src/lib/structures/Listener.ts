import type { ClientEvents, WSEventType } from 'discord.js';
import { s } from '@sapphire/shapeshift';
import type { GClient } from '../GClient';
import { Listeners } from '../managers/ListenerManager';
import { Logger } from '../util/logger/Logger';

export interface ListenerOptions<
	WS extends boolean,
	Event extends WS extends true ? WSEventType : keyof ClientEvents,
> {
	event: Event | string;
	name: string;
	once?: boolean;
	ws?: WS;
	fileName?: string;
	run?: (
		...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<any>
	) => any;
}

const parser = s.object({
	event: s.string,
	name: s.string,
	once: s.boolean.optional.default(false),
	ws: s.boolean.optional.default(false),
	fileName: s.string.optional,
	run: s.any,
});

export class Listener<
	WS extends boolean = boolean,
	Event extends WS extends true
		? WSEventType
		: keyof ClientEvents = WS extends true ? WSEventType : keyof ClientEvents,
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
		try {
			const parsed = parser.passthrough.parse({ ...options, ...this });
			this.event = parsed.event;
			this.name = parsed.name;
			this.once = parsed.once;
			this.ws = parsed.ws as WS;
			this.fileName = parsed.fileName;
			this.run = parsed.run;

			Listeners.register(this);
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

		if (this.ws)
			client.ws[this.once ? 'once' : 'on'](
				this.event as WSEventType,
				this._run.bind(this),
			);
		else
			client[this.once ? 'once' : 'on'](
				this.event as keyof ClientEvents,
				this._run.bind(this),
			);
	}

	public unregister(): Listener | void {
		return Listeners.unregister(this.name);
	}

	public async _run(...args: Array<any>): Promise<void> {
		await Promise.resolve(this.run.call(this, ...args)).catch(error => {
			Logger.error(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
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
