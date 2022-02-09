import { PrismaClient } from '@prisma/client';
import Logger from 'js-logger';
import { Provider, ProviderTypes } from '../lib/structures/Provider';

export class PrismaIOProvider extends Provider {
	client: PrismaClient;
	type: ProviderTypes;

	constructor(options?: string) {
		super();

		this.type = 'prismaio';
		this.client = new PrismaClient(options);
	}

	async init(): Promise<void> {
		Logger.debug('PrismaIO initializated!');
		this.emit('connected', this.client);

		return;
	}

	async insert(model: string, options: any) {
		const data = await this.client[model].create(options);

		return data;
	}

	async get(model: string, options: any) {
		const data = await this.client[model].findUnique(options);

		return data;
	}

	async getMany(model: string, options: any) {
		const data = await this.client[model].findMany(options);

		return data;
	}

	async update(model: string, options: any) {
		const data = await this.client[model].update(options);

		return data;
	}

	async delete(model: string, options: any) {
		const data = await this.client[model].delete(options);

		return data;
	}
}
