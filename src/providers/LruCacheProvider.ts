import Logger from 'js-logger';
import LruCache from 'lru-cache';
import { Provider, ProviderInterface } from '../lib/structures/Provider';

export class LruCacheProvider extends Provider implements ProviderInterface {
	uri: string;
	client: LruCache<unknown, unknown>;

	constructor(options: LruCache.Options<unknown, unknown>) {
		super();

		this.client = new LruCache(options);
	}

	async init(): Promise<void> {
        Logger.debug('LruCache initializated!');

        this.emit('connect', this.client);

		return;
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
		const data = await this.client.set(key, value, maxAge);

		return data;
	}

	async delete(key: string) {
		const data = await this.client.del(key);

		return data;
	}

    clear() {
        return this.client.reset();
    }
}