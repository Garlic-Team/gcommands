import LruCache from 'lru-cache';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
export declare class LruCacheProvider extends Provider {
    client: LruCache<unknown, unknown>;
    type: ProviderTypes;
    constructor(options: LruCache.Options<unknown, unknown>);
    init(): Promise<void>;
    insert(key: string, value: any, maxAge?: number): Promise<LruCache<unknown, unknown>>;
    get(key: string): Promise<unknown>;
    update(key: string, value: any, maxAge?: number): Promise<LruCache<unknown, unknown>>;
    delete(key: string): Promise<boolean>;
    clear(): void;
}
//# sourceMappingURL=LruCacheProvider.d.ts.map