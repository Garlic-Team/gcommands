import LruCache from 'lru-cache';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
import { Logger } from '../lib/util/logger/Logger';

export class LruCacheProvider extends Provider {
	client: LruCache<unknown, unknown>;
	type: ProviderTypes;

	constructor(options: LruCache.Options<unknown, unknown>) {
		super();

		this.type = 'lrucache';
		this.client = new LruCache(options);
	}

	async init(): Promise<void> {
		Logger.debug('LruCache initializated!');
		this.emit('connected', this.client);
	}

	async insert(key: string, value: any, maxAge?: number) {
		const data = await this.update(key, value, maxAge);

		return data;
	}

	async get(key: string) {
		const data = await this.client.get(key);

		return data;
	}

	async update(key: string, value: any, maxAge?: number) {
		const data = await this.client.set(key, value, {
			ttl: maxAge,
		});

		return data;
	}

	async delete(key: string) {
		const data = await this.client.delete(key);

		return data;
	}

	clear() {
		return this.client.clear();
	}
}
