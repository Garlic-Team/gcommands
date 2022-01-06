import Logger from 'js-logger';
import Keyv from 'keyv';
import { Provider, ProviderTypes } from '../lib/structures/Provider';

export class KeyvProvider extends Provider {
	uri: string;
	client: Keyv;
	type: ProviderTypes;

	constructor(uri?: string) {
		super();

		this.uri = uri;
		this.type = 'keyv';

		this.client = null;
	}

	async init(): Promise<void> {
		this.client = new Keyv(this.uri);

		Logger.debug('Keyv initializated!');
		this.emit('connected', this.client);

		return;
	}

	async insert(key: string, value: any, ttl?: number) {
		const data = await this.update(key, value, ttl);

		return data;
	}

	async get(key: string) {
		const data = await this.client.get(key);

		return data;
	}

	async update(key: string, value: any, ttl?: number) {
		const data = await this.client.set(key, value, ttl);

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