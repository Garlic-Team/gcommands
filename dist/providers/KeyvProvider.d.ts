import Keyv from 'keyv';
import { Provider, ProviderTypes } from '../lib/structures/Provider';
export declare class KeyvProvider extends Provider {
    uri: string | undefined;
    client: Keyv | null;
    opts: Keyv.Options<any> | undefined;
    type: ProviderTypes;
    constructor(uri?: string, opts?: Keyv.Options<any>);
    init(): Promise<void>;
    insert(key: string, value: any, ttl?: number): Promise<true>;
    get(key: string): Promise<any>;
    update(key: string, value: any, ttl?: number): Promise<true>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<void>;
}
//# sourceMappingURL=KeyvProvider.d.ts.map