import { PrismaClient } from '@prisma/client';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
export declare class PrismaIOProvider extends Provider {
    client: PrismaClient;
    type: ProviderTypes;
    constructor(options?: string);
    init(): Promise<void>;
    insert(model: string, options: any): Promise<any>;
    get(model: string, options: any): Promise<any>;
    getMany(model: string, options: any): Promise<any>;
    update(model: string, options: any): Promise<any>;
    delete(model: string, options: any): Promise<any>;
}
//# sourceMappingURL=PrismaIOProvider.d.ts.map