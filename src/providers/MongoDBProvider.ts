import Logger from 'js-logger';
import { Collection, Db, Document, Filter, FindOptions, MongoClient, UpdateFilter, UpdateOptions } from 'mongodb';
import { Provider, ProviderInterface } from '../lib/structures/Provider';

export class MongoDBProvider extends Provider implements ProviderInterface {
	uri: string;
	dbName?: string;
	client: MongoClient;
	db: Db;

	constructor(uri?: string, dbName?: string) {
		super();

		this.uri = uri;
		this.dbName = dbName;

		this.client = new MongoClient(this.uri);
		this.db = null;
	}

	async init(): Promise<void> {
		await this.client.connect()
			.catch((error) => {
				Logger.error(error.code, error.message);
				if (error.stack) Logger.trace(error.stack);
			})
			.then(() => {
				Logger.debug('Connected to MongoDB!');

				this.emit('connect', this.client);
			});

		this.db = this.client.db(this?.dbName);

		return;
	}

	async insert(collectionName: string, document: Document) {
		const collection = this.db.collection(collectionName);
		const data = await collection.insertOne(document);

		return data;
	}

	async get(collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>) {
		const collection = this.db.collection(collectionName);
		const data = options ? await collection.findOne(filter, options) : await collection.findOne(filter);

		return data;
	}

	async update(collectionName: string, filter: Filter<Document>, set: UpdateFilter<Document>,  options?: UpdateOptions) {
		const collection = this.db.collection(collectionName);
		const data = options ? await collection.updateOne(filter, set, options) : await collection.updateOne(filter, set);

		return data;
	}

	async delete(collectionName: string, filter: Filter<Document>) {
		const collection = this.db.collection(collectionName);
		const data = await collection.deleteOne(filter);
		
		return data;
	}
}