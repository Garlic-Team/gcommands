import {
	Db,
	Document,
	Filter,
	FindOptions,
	MongoClient,
	UpdateFilter,
	UpdateOptions,
} from 'mongodb';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
import { Logger } from '../lib/util/logger/Logger';

/**
 * The class that represents the MongoDB provider.
 * @extends {Provider}
 */
export class MongoDBProvider extends Provider {
	/**
	 * MongoDB connection uri
	 * @type {string}
	 */
	uri: string;
	/**
	 * MongoDB database name
	 * @type {?string}
	 */
	dbName?: string | undefined;
	/**
	 * MongoDB client
	 * @type {MongoClient}
	 */
	client: MongoClient;
	/**
	 * MongoDB database
	 * @type {?Db}
	 */
	db: Db | null;
	/**
	 * The type of the provider.
	 * @type {ProviderTypes}
	 */
	type: ProviderTypes;

	constructor(uri: string, dbName?: string) {
		super();

		this.uri = uri;
		this.dbName = dbName;
		this.type = 'mongodb';

		this.client = new MongoClient(this.uri);
		this.db = null;
	}

	/**
	 * The method that initializes the provider.
	 */
	async init(): Promise<void> {
		await this.client
			.connect()
			.catch(error => {
				Logger.error(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			})
			.then(() => {
				Logger.debug('MongoDB initializated!');

				this.db = this.client.db(this?.dbName);
				this.emit('connected', this.client);
			});
	}

	/**
	 * The method that create a new collection.
	 * @param {String} collectionName The collection name to create document into.
	 * @param {Document} document The document to create.
	 * @returns {any}
	 */
	async insert(collectionName: string, document: Document) {
		const collection = this.db?.collection(collectionName);
		const data = await collection?.insertOne(document);

		return data;
	}

	/**
	 * The method that return an existing document.
	 * @param {String} collectionName The collection name to search document into.
	 * @param {Filter<Document>} filter The filter to search document.
	 * @param {FindOptions<Document>} options The options to search document.
	 * @returns {Promise<WithId<Document>>}
	 */
	async get(
		collectionName: string,
		filter: Filter<Document>,
		options?: FindOptions<Document>,
	) {
		const collection = this.db?.collection(collectionName);
		const data = options
			? await collection?.findOne(filter, options)
			: await collection?.findOne(filter);

		return data;
	}

	/**
	 * The method that return an existing documents.
	 * @param {String} collectionName The collection name to search documents into.
	 * @param {Filter<Document>} filter The filter to search documents.
	 * @param {FindOptions<Document>} options The options to search documents.
	 * @returns {Promise<FindCursor<WithId<Document>>>}
	 */
	async getMany(
		collectionName: string,
		filter: Filter<Document>,
		options?: FindOptions<Document>,
	) {
		const collection = this.db?.collection(collectionName);
		const data = options
			? await collection?.find(filter, options)
			: await collection?.find(filter);

		return data;
	}

	/**
	 * The method that update an existing document.
	 * @param {String} collectionName The collection name to update document into.
	 * @param {Filter<Document> }filter The filter to update document.
	 * @param {UpdateFilter<Document>} set New options for document.
	 * @param {UpdateOptions} options The options to update document.
	 * @returns {Promise<UpdateResult>}
	 */
	async update(
		collectionName: string,
		filter: Filter<Document>,
		set: UpdateFilter<Document>,
		options?: UpdateOptions,
	) {
		const collection = this.db?.collection(collectionName);
		const data = options
			? await collection?.updateOne(filter, set, options)
			: await collection?.updateOne(filter, set);

		return data;
	}

	/**
	 * The method that deletes an existing documents.
	 * @param {String} collectionName The collection name to delete documents into.
	 * @param {Filter<Document>} filter The filter to delete document.
	 * @returns {Promise<DeleteResult>}
	 */
	async delete(collectionName: string, filter: Filter<Document>) {
		const collection = this.db?.collection(collectionName);
		const data = await collection?.deleteOne(filter);

		return data;
	}
}
