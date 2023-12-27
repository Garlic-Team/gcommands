import { LRUCache } from 'lru-cache';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
import { Logger } from '../lib/util/logger/Logger';

export class LruCacheProvider<
	// eslint-disable-next-line @typescript-eslint/ban-types
	K extends {},
	// eslint-disable-next-line @typescript-eslint/ban-types
	V extends {},
	FC = unknown,
> extends Provider {
	client: LRUCache<K, V, FC>;
	type: ProviderTypes;

	constructor(options: LRUCache.Options<K, V, FC>) {
		super();

		this.type = 'lrucache';
		this.client = new LRUCache(options);
	}

	async init(): Promise<void> {
		Logger.debug('LruCache initializated!');
		this.emit('connected', this.client);
	}

	insert(key: K, value: V, maxAge?: number) {
		const data = this.update(key, value, maxAge);

		return data;
	}

	get(key: K): V {
		const data = this.client.get(key);

		return data;
	}

	update(key: K, value: V, maxAge?: number) {
		const data = this.client.set(key, value, {
			ttl: maxAge,
		});

		return data;
	}

	delete(key: K) {
		const data = this.client.delete(key);

		return data;
	}

	clear() {
		return this.client.clear();
	}
}
