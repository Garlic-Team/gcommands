"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBProvider = void 0;
const Logger_1 = require("../lib/util/logger/Logger");
const mongodb_1 = require("mongodb");
const Provider_1 = require("../lib/structures/Provider");
class MongoDBProvider extends Provider_1.Provider {
    constructor(uri, dbName) {
        super();
        this.uri = uri;
        this.dbName = dbName;
        this.type = 'mongodb';
        this.client = new mongodb_1.MongoClient(this.uri);
        this.db = null;
    }
    async init() {
        await this.client
            .connect()
            .catch((error) => {
            Logger_1.Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
            if (error.stack)
                Logger_1.Logger.trace(error.stack);
        })
            .then(() => {
            Logger_1.Logger.debug('MongoDB initializated!');
            this.db = this.client.db(this?.dbName);
            this.emit('connected', this.client);
        });
        return;
    }
    async insert(collectionName, document) {
        const collection = this.db?.collection(collectionName);
        const data = await collection?.insertOne(document);
        return data;
    }
    async get(collectionName, filter, options) {
        const collection = this.db?.collection(collectionName);
        const data = options ? await collection?.findOne(filter, options) : await collection?.findOne(filter);
        return data;
    }
    async getMany(collectionName, filter, options) {
        const collection = this.db?.collection(collectionName);
        const data = options ? await collection?.find(filter, options) : await collection?.find(filter);
        return data;
    }
    async update(collectionName, filter, set, options) {
        const collection = this.db?.collection(collectionName);
        const data = options ? await collection?.updateOne(filter, set, options) : await collection?.updateOne(filter, set);
        return data;
    }
    async delete(collectionName, filter) {
        const collection = this.db?.collection(collectionName);
        const data = await collection?.deleteOne(filter);
        return data;
    }
}
exports.MongoDBProvider = MongoDBProvider;
