import { Listener } from '../structures/Listener';
import { ClientEvents, Collection, WSEventType } from 'discord.js';
import { Events, Logger } from '../util/logger/Logger';
import { container } from '../structures/Container';

export class ListenerManager extends Collection<string, Listener> {
	public register(listener: Listener): ListenerManager {
		if (listener instanceof Listener) {
			if (this.has(listener.name)) {
				this.get(listener.name).unregister();
				if (!this.get(listener.name)?.reloading) Logger.warn('Overwriting listener', listener.name);
			}
			if (container.client) listener.load();
			this.set(listener.name, listener);
			Logger.emit(Events.LISTENER_REGISTERED, listener);
			Logger.debug('Registered listener', listener.name, 'listening to', listener.event);
		} else Logger.warn('Listener must be a instance of Listener');

		return this;
	}

	public unregister(name: string): Listener | undefined {
		const { client } = container;

		const listener = this.get(name);
		if (listener) {
			this.delete(name);

			if (client) {
				const maxListeners = client.getMaxListeners();
				if (maxListeners !== 0) client.setMaxListeners(maxListeners - 1);

				listener.ws
					? client.ws.off(listener.event as WSEventType, listener._run)
					: client.off(listener.event as keyof ClientEvents, listener._run);
			}

			Logger.emit(Events.LISTENER_UNREGISTERED, listener);
			Logger.debug('Unregistered listener', listener.name, 'listening to', listener.event);
		}

		return listener;
	}

	public load() {
		this.forEach((listener) => listener.load());
	}
}

export const Listeners = new ListenerManager();
