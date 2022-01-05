import Keyv from 'keyv';
import { Provider, ProviderInterface } from '../lib/structures/Provider';

export class KeyvProvider extends Provider implements ProviderInterface {
	uri: string;
	client: Keyv;

	constructor(uri?: string) {
		super();

		this.uri = uri;

		this.client = null;
	}

	async init(): Promise<void> {
        this.client = new Keyv(this.uri);

		return;
	}

	async insert(key: string, options?: any) {
		const data = await this.update(key, options);

		return data;
	}

	async get(key: string, options?: any) {
		const data = await this.client.get(key, options);

		return data;
	}

	async update(key: string, options?: any) {
		const data = await this.client.set(key, options);

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