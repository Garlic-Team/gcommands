"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreProvider = void 0;
const firestore_1 = require("@google-cloud/firestore");
const Logger_1 = require("../lib/util/logger/Logger");
const Provider_1 = require("../lib/structures/Provider");
class FirestoreProvider extends Provider_1.Provider {
    constructor(options) {
        super();
        this.client = new firestore_1.Firestore(options);
        this.type = 'firestore';
    }
    async init() {
        Logger_1.Logger.debug('Firestore initializated!');
        this.emit('connected', this.client);
        return;
    }
    async insert(documentName, value) {
        const document = this.client.doc(documentName);
        const data = await document.set(value);
        return data;
    }
    async get(documentName) {
        const document = this.client.doc(documentName);
        const data = await document.get();
        return data;
    }
    async update(documentName, value) {
        const document = this.client.doc(documentName);
        const data = await document.update(value);
        return data;
    }
    async delete(documentName) {
        const document = this.client.doc(documentName);
        const data = await document.delete();
        return data;
    }
}
exports.FirestoreProvider = FirestoreProvider;
