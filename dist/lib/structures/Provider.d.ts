/// <reference types="node" />
import { EventEmitter } from 'events';
export declare type ProviderTypes = 'mongodb' | 'keyv' | 'lrucache' | 'prismaio' | 'firestore' | string;
export interface ProviderEvents {
    connected: (client?: any) => void;
}
export declare interface Provider {
    on<U extends keyof ProviderEvents>(event: U, listener: ProviderEvents[U]): this;
    emit<U extends keyof ProviderEvents>(event: U, ...args: Parameters<ProviderEvents[U]>): boolean;
    client: any;
    init(): Promise<void> | void;
    insert(...args: any[]): Promise<any> | any;
    get(...args: any[]): Promise<any> | any;
    update(...args: any[]): Promise<any> | any;
    delete(...args: any[]): Promise<any> | any;
}
export declare class Provider extends EventEmitter {
}
//# sourceMappingURL=Provider.d.ts.map