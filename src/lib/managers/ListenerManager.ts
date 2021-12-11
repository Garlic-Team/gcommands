import {GClient} from '../GClient';
import {Events} from '../util/Events';
import {Listener} from '../structures/Listener';
import {Collection} from 'discord.js';

export class ListenerManager extends Collection<string, Listener<any>> {
	private client: GClient;

	public register(listener: Listener<any>): ListenerManager {
		if (listener instanceof Listener) {
			if (this.client) this.initialize(listener);
			if (this.has(listener.name) && this.client) {
				this.get(listener.name).unregister();
				this.client.emit(Events.WARN, `Overwriting listener ${listener.name}`);
			}
			this.set(listener.name, listener);
		} else throw new TypeError('Listener does not implement or extend the Listener class');

		return this;
	}

	public unregister(name: string): Listener<any> | undefined {
		const listener = this.get(name);
		if (listener) {
			this.delete(name);
			const maxListeners = this.client.getMaxListeners();
			if (maxListeners !== 0) this.client.setMaxListeners(maxListeners - 1);

			this.client.off(listener.event, listener.run);
			this.client.emit(Events.LISTENER_UNREGISTER, listener);
		}

		return listener;
	}

	private initialize(listener: Listener<any>): Listener<any> {
		const maxListeners = this.client.getMaxListeners();
		if (maxListeners !== 0) this.client.setMaxListeners(maxListeners + 1);

		listener.initialize(this.client);

		return listener;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach(listener => listener.initialize(client));
	}
}
