import { Provider, ProviderInterface } from '../lib/structures/Provider';

export class MongooseProvider extends Provider implements ProviderInterface {
	init() {
		return 'test';
	}

	async get() {
		return 'test';
	}

	async set() {
		return 'test';
	}

	async delete() {
		return 'test';
	}
}