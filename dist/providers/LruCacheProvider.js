"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LruCacheProvider = void 0;
const tslib_1 = require("tslib");
const Logger_1 = require("../lib/util/logger/Logger");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const Provider_1 = require("../lib/structures/Provider");
class LruCacheProvider extends Provider_1.Provider {
    constructor(options) {
        super();
        this.type = 'lrucache';
        this.client = new lru_cache_1.default(options);
    }
    async init() {
        Logger_1.Logger.debug('LruCache initializated!');
        this.emit('connected', this.client);
        return;
    }
    async insert(key, value, maxAge) {
        const data = await this.update(key, value, maxAge);
        return data;
    }
    async get(key) {
        const data = await this.client.get(key);
        return data;
    }
    async update(key, value, maxAge) {
        const data = await this.client.set(key, value, {
            ttl: maxAge
        });
        return data;
    }
    async delete(key) {
        const data = await this.client.delete(key);
        return data;
    }
    clear() {
        return this.client.clear();
    }
}
exports.LruCacheProvider = LruCacheProvider;
