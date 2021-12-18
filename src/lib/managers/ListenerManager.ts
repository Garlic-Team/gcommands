import {GClient} from '../GClient';
import {Listener} from '../structures/Listener';
import {Collection} from 'discord.js';
import Logger from 'js-logger';

export class ListenerManager extends Collection<string, Listener<any>> {
	private client: GClient;

	public register(listener: Listener<any>): ListenerManager {
		if (listener instanceof Listener) {
			if (this.has(listener.name)) {
				this.get(listener.name).unregister();
				if (!this.get(listener.name)?.reloading) Logger.warn('Overwriting listener', listener.name);
			}
			if (!Listener.validate(listener)) return;
			if (this.client) this.initialize(listener);
			this.set(listener.name, listener);
			Logger.debug('Registered listener', listener.name, 'listening to', listener.event);
		} else Logger.warn('Listener must be a instance of Listener');

		return this;
	}

	public unregister(name: string): Listener<any> | undefined {
		const listener = this.get(name);
		if (listener) {
			this.delete(name);
			const maxListeners = this.client.getMaxListeners();
			if (maxListeners !== 0) this.client.setMaxListeners(maxListeners - 1);

			this.client.off(listener.event, listener.run);
			Logger.debug('Unregistered listener', listener.name, 'listening to', listener.event);
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

export const Listeners = new ListenerManager();
