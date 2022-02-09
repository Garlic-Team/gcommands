import type { GClient } from '../GClient';
import { Listener } from '../structures/Listener';
import { ClientEvents, Collection, WSEventType } from 'discord.js';
import { Logger, Events } from '../util/logger/Logger';
import { Plugins } from './PluginManager';

export class ListenerManager extends Collection<string, Listener> {
	private client: GClient;

	public register(listener: Listener): ListenerManager {
		if (listener instanceof Listener) {
			if (this.has(listener.name)) {
				this.get(listener.name).unregister();
				if (!this.get(listener.name)?.reloading) Logger.warn('Overwriting listener', listener.name);
			}
			if (this.client) this.initialize(listener);
			if (Plugins.currentlyLoading) listener.owner = Plugins.currentlyLoading;
			this.set(listener.name, listener);
			Logger.emit(Events.LISTENER_REGISTERED, listener);
			Logger.debug(
				'Registered listener',
				listener.name,
				'listening to',
				listener.event,
				listener.owner ? `(by plugin ${listener.owner})` : '',
			);
		} else Logger.warn('Listener must be a instance of Listener');

		return this;
	}

	public unregister(name: string): Listener | undefined {
		const listener = this.get(name);
		if (listener) {
			this.delete(name);

			if (this.client) {
				const maxListeners = this.client.getMaxListeners();
				if (maxListeners !== 0) this.client.setMaxListeners(maxListeners - 1);

				listener.ws
					? this.client.ws.off(listener.event as WSEventType, listener._run)
					: this.client.off(listener.event as keyof ClientEvents, listener._run);
			}

			Logger.emit(Events.LISTENER_UNREGISTERED, listener);
			Logger.debug('Unregistered listener', listener.name, 'listening to', listener.event);
		}

		return listener;
	}

	private initialize(listener: Listener): Listener {
		const maxListeners = this.client.getMaxListeners();
		if (maxListeners !== 0) this.client.setMaxListeners(maxListeners + 1);

		listener.initialize(this.client);

		return listener;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach((listener) => listener.initialize(client));
	}
}

export const Listeners = new ListenerManager();
