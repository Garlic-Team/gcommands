import {GClient} from '../GClient';
import {ClientEvents, WSEventType} from 'discord.js';
import {Listeners} from '../managers/ListenerManager';
import Logger from 'js-logger';
import {Util} from '../util/Util';

export interface ListenerOptions<Event extends keyof ClientEvents> {
	event: Event;
	name: string;
	once?: boolean;
	ws?: boolean;
	fileName?: string;
	run?: (...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<any>) => any;
}

export class Listener<Event extends keyof ClientEvents = keyof ClientEvents> {
	public client: GClient;
	public readonly event: string;
	public readonly name: string;
	public readonly once?: boolean;
	public readonly ws?: boolean;
	public readonly fileName?: string;
	public readonly run: (...args: Array<any>) => any;
	public owner?: string;
	public reloading = false;

	public constructor(options: ListenerOptions<Event>) {
		Object.assign(this, options);

		Listeners.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		if (this.ws) client.ws[this.once ? 'once' : 'on'](this.event as WSEventType, this._run.bind(this));
		else client[this.once ? 'once' : 'on'](this.event as keyof ClientEvents, this._run.bind(this));
	}

	public static validate(listener: Listener): boolean | void {
		const trace = Util.resolveValidationErrorTrace([
			listener.name,
			listener.fileName,
		]);

		if (!listener.name) return Logger.warn('Listener must have a name', trace);
		else if (typeof listener.name !== 'string') return Logger.warn('Listener name must be a string', trace);
		else if (!listener.event) return Logger.warn('Listener must have a event', trace);
		else if (typeof listener.event !== 'string') return Logger.warn('Listener event must be a string', trace);
		else if (typeof listener.run !== 'function') return Logger.warn('Listener must have a run function', trace);
		else return true;
	}

	public unregister() {
		return Listeners.unregister(this.name);
	}

	private async _run(...args: Array<any>): Promise<void> {
		await Promise.resolve(this.run.call(this, ...args)).catch((error) => {
			Logger.error(error.code, error.message);
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
