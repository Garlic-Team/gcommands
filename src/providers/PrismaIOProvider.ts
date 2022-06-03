import { PrismaClient } from '@prisma/client';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
import { Logger } from '../lib/util/logger/Logger';

/**
 * The class that represents the Prisma.io provider.
 * @extends {Provider}
 */
export class PrismaIOProvider extends Provider {
	/**
	 * Prisma.io client.
	 * @type {PrismaClient}
	 */
	public client: PrismaClient;
	/**
	 * The type of the provider.
	 * @type {ProviderTypes}
	 */
	public type: ProviderTypes;

	constructor(options?: string) {
		super();

		this.type = 'prismaio';
		this.client = new PrismaClient(options);
	}

	/**
	 * The method that initializes the provider.
	 */
	async init(): Promise<void> {
		Logger.debug('PrismaIO initializated!');
		this.emit('connected', this.client);
	}

	/**
	 * The method that create a new model.
	 * @param {String} model The model name to create.
	 * @param {any} options The options to create the model with.
	 * @returns {any}
	 */
	async insert(model: string, options: any) {
		const data = await this.client[model].create(options);

		return data;
	}

	/**
	 * The method that return an existing model.
	 * @param {String} model The model name to get.
	 * @param {any} options The options to get the model with.
	 * @returns {any}
	 */
	async get(model: string, options: any) {
		const data = await this.client[model].findUnique(options);

		return data;
	}

	/**
	 * The method that return an existing models.
	 * @param {String} model The model name to get.
	 * @param {any} options The options to get the model with.
	 * @returns {any}
	 */
	async getMany(model: string, options: any) {
		const data = await this.client[model].findMany(options);

		return data;
	}

	/**
	 * The method that updates an existing model.
	 * @param {String} model The model name to update.
	 * @param {any} options The options to update the model with.
	 * @returns {any}
	 */
	async update(model: string, options: any) {
		const data = await this.client[model].update(options);

		return data;
	}

	/**
	 * The method that deletes an existing model.
	 * @param {String} model The model name to delete.
	 * @param {any} options The options to delete the model with.
	 * @returns {any}
	 */
	async delete(model: string, options: any) {
		const data = await this.client[model].delete(options);

		return data;
	}
}
