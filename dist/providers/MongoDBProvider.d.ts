import { Db, Document, Filter, FindOptions, MongoClient, UpdateFilter, UpdateOptions } from 'mongodb';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
export declare class MongoDBProvider extends Provider {
    uri: string;
    dbName?: string | undefined;
    client: MongoClient;
    db: Db | null;
    type: ProviderTypes;
    constructor(uri: string, dbName?: string);
    init(): Promise<void>;
    insert(collectionName: string, document: Document): Promise<import("mongodb").InsertOneResult<Document>>;
    get(collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<import("mongodb").WithId<Document>>;
    getMany(collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<import("mongodb").FindCursor<import("mongodb").WithId<Document>>>;
    update(collectionName: string, filter: Filter<Document>, set: UpdateFilter<Document>, options?: UpdateOptions): Promise<import("mongodb").UpdateResult>;
    delete(collectionName: string, filter: Filter<Document>): Promise<import("mongodb").DeleteResult>;
}
//# sourceMappingURL=MongoDBProvider.d.ts.map