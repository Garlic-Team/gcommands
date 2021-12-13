import {GClient} from '../GClient';
import {ClientEvents} from 'discord.js';
import {Events} from '../util/Events';

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
		Listener.validate(event, options, this.run);

		this.event = event;
		Object.assign(this, options);

		GClient.glisteners.register(this);
	}

	public initialize(client: GClient): void {
		this.client = client;

		client[this.once ? 'once' : 'on'](this.event, this._run.bind(this));
	}

	private async _run(...args: Array<any>): Promise<void> {
		await Promise.resolve(this.run.call(this, ...args)).catch((error) => this.client.emit(Events.ERROR, error));
	}

	public unregister() {
		return GClient.glisteners.unregister(this.name);
	}

	private static validate(event: string, options: ListenerOptions<any>, run: (...args: Array<any>) => any) {
		if (!event) throw new TypeError('Listener must have a event');
		if (!options.name) throw new TypeError('Listener must have a name');
		if (typeof options.name !== 'string') throw new TypeError('Listener name must be a string');
		if (typeof event !== 'string') throw new TypeError('Listener event must be a string');
		if (typeof options.run !== 'function' && typeof run !== 'function') throw new TypeError('Listener must have a run function');
	}
}
