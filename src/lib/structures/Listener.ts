import {GClient} from '../GClient';
import {ClientEvents} from 'discord.js';
import {Listeners} from '../managers/ListenerManager';
import Logger from 'js-logger';

export interface ListenerOptions<Event extends keyof ClientEvents> {
	name: string;
	run?: (...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<unknown>) => any;
}

// TODO event should be in ListenerOptions (switched with name) (help pending in TS discord server)

export class Listener<Event extends keyof ClientEvents> {
	public client: GClient;
	public readonly event: Event;
	public readonly name: string;
	public readonly once: boolean;
	public readonly run: (...args: Event extends keyof ClientEvents ? ClientEvents[Event] : Array<unknown>) => any;

	public constructor(event: Event, options: ListenerOptions<Event>) {
		this.event = event;
		Object.assign(this, options);

		Listeners.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		client[this.once ? 'once' : 'on'](this.event, this._run.bind(this));
	}

	public static validate(listener: Listener<any>): boolean | void {
		if (!listener.name) return Logger.warn('Listener must have a name');
		else if (typeof listener.name !== 'string') return Logger.warn('Listener name must be a string');
		else if (!listener.event) return Logger.warn('Listener', listener.name, 'must have a event');
		else if (typeof listener.event !== 'string') return Logger.warn('Listener', listener.name, 'event must be a string');
		else if (typeof listener.run !== 'function') return Logger.warn('Listener', listener.name, 'must have a run function');
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
}
