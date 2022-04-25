"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaIOProvider = void 0;
const client_1 = require("@prisma/client");
const Logger_1 = require("../lib/util/logger/Logger");
const Provider_1 = require("../lib/structures/Provider");
class PrismaIOProvider extends Provider_1.Provider {
    constructor(options) {
        super();
        this.type = 'prismaio';
        this.client = new client_1.PrismaClient(options);
    }
    async init() {
        Logger_1.Logger.debug('PrismaIO initializated!');
        this.emit('connected', this.client);
        return;
    }
    async insert(model, options) {
        const data = await this.client[model].create(options);
        return data;
    }
    async get(model, options) {
        const data = await this.client[model].findUnique(options);
        return data;
    }
    async getMany(model, options) {
        const data = await this.client[model].findMany(options);
        return data;
    }
    async update(model, options) {
        const data = await this.client[model].update(options);
        return data;
    }
    async delete(model, options) {
        const data = await this.client[model].delete(options);
        return data;
    }
}
exports.PrismaIOProvider = PrismaIOProvider;
