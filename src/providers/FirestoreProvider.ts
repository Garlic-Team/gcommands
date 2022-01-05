import { Firestore } from '@google-cloud/firestore';
import { Provider, ProviderInterface } from '../lib/structures/Provider';

export class FirestoreProvider extends Provider implements ProviderInterface {
	uri: string;
	client: Firestore;

	constructor(options?: FirebaseFirestore.Settings) {
		super();

		this.client = new Firestore(options);
	}

	async init(): Promise<void> {
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