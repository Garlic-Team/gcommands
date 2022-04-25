import { Firestore } from '@google-cloud/firestore';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
export declare class FirestoreProvider extends Provider {
    client: Firestore;
    type: ProviderTypes;
    constructor(options?: FirebaseFirestore.Settings);
    init(): Promise<void>;
    insert(documentName: string, value: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>): Promise<FirebaseFirestore.WriteResult>;
    get(documentName: string): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>>;
    update(documentName: string, value: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>): Promise<FirebaseFirestore.WriteResult>;
    delete(documentName: string): Promise<FirebaseFirestore.WriteResult>;
}
//# sourceMappingURL=FirestoreProvider.d.ts.map