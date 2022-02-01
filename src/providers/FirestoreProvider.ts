import { Firestore } from '@google-cloud/firestore';
import { Logger } from '../lib/util/logger/Logger';
import { Provider, ProviderTypes } from '../lib/structures/Provider';

export class FirestoreProvider extends Provider {
	client: Firestore;
	type: ProviderTypes;

	constructor(options?: FirebaseFirestore.Settings) {
		super();

		this.client = new Firestore(options);
		this.type = 'firestore';
	}

	async init(): Promise<void> {
		Logger.debug('Firestore initializated!');
		this.emit('connected', this.client);

		return;
	}

	async insert(documentName: string, value: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>) {
		const document = this.client.doc(documentName);
		const data = await document.set(value);

		return data;
	}

	async get(documentName: string) {
		const document = this.client.doc(documentName);
		const data = await document.get();

		return data;
	}

	async update(documentName: string, value: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>) {
		const document = this.client.doc(documentName);
		const data = await document.update(value);

		return data;
	}

	async delete(documentName: string) {
		const document = this.client.doc(documentName);
		const data = await document.delete();

		return data;
	}
}
