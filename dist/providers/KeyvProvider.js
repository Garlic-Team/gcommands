"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyvProvider = void 0;
const tslib_1 = require("tslib");
const Logger_1 = require("../lib/util/logger/Logger");
const keyv_1 = tslib_1.__importDefault(require("keyv"));
const Provider_1 = require("../lib/structures/Provider");
class KeyvProvider extends Provider_1.Provider {
    constructor(uri, opts) {
        super();
        this.uri = uri;
        this.opts = opts;
        this.type = 'keyv';
        this.client = null;
    }
    async init() {
        this.client = new keyv_1.default(this.uri, this.opts);
        Logger_1.Logger.debug('Keyv initializated!');
        this.emit('connected', this.client);
        return;
    }
    async insert(key, value, ttl) {
        const data = await this.update(key, value, ttl);
        return data;
    }
    async get(key) {
        const data = await this.client?.get(key);
        return data;
    }
    async update(key, value, ttl) {
        const data = await this.client?.set(key, value, ttl);
        return data;
    }
    async delete(key) {
        const data = await this.client?.delete(key);
        return data;
    }
    clear() {
        return this.client?.clear();
    }
}
exports.KeyvProvider = KeyvProvider;
