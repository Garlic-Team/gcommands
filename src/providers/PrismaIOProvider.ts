import { PrismaClient } from '@prisma/client';
import { Provider, ProviderInterface } from '../lib/structures/Provider';

export interface PrismaIOProviderInterface extends ProviderInterface {
	client: PrismaClient;
}

export class PrismaIOProvider extends Provider implements PrismaIOProviderInterface {
	uri: string;
	client: PrismaClient;

	constructor(options?: string) {
		super();
        
		this.client = new PrismaClient(options);

		Object.defineProperties(this, this.client);
	}

	async init(): Promise<void> {
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

	async update(model: string, options: any) {
		const data = await this.client[model].update(options);

		return data;
	}

	async delete(model: string, options: any) {
		const data = await this.client[model].delete(options);

		return data;
	}
}