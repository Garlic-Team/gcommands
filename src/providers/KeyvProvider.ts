import { Logger } from '../lib/util/logger/Logger';
import Keyv from 'keyv';
import { Provider, ProviderTypes } from '../lib/structures/Provider';

export class KeyvProvider extends Provider {
	uri: string | undefined;
	client: Keyv | null;
	opts: Keyv.Options<any> | undefined;
	type: ProviderTypes;

	constructor(uri?: string, opts?: Keyv.Options<any>) {
		super();

		this.uri = uri;
		this.opts = opts;
		this.type = 'keyv';

		this.client = null;
	}

	async init(): Promise<void> {
		this.client = new Keyv(this.uri, this.opts);

		Logger.debug('Keyv initializated!');
		this.emit('connected', this.client);

		return;
	}

	async insert(key: string, value: any, ttl?: number) {
		const data = await this.update(key, value, ttl);

		return data;
	}

	async get(key: string) {
		const data = await this.client?.get(key);

		return data;
	}

	async update(key: string, value: any, ttl?: number) {
		const data = await this.client?.set(key, value, ttl);

		return data;
	}

	async delete(key: string) {
		const data = await this.client?.delete(key);

		return data;
	}

	clear() {
		return this.client?.clear();
	}
}
