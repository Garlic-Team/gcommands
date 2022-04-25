import type { GClient } from '../GClient';
export interface PluginOptions {
    name: string;
    afterInitialization?: (client: GClient) => any;
    beforeLogin?: (client: GClient) => any;
    afterLogin?: (client: GClient) => any;
}
export declare class Plugin {
    name: string;
    afterInitialization: (client: GClient) => any;
    beforeLogin: (client: GClient) => any;
    afterLogin: (client: GClient) => any;
    constructor(options: PluginOptions);
}
//# sourceMappingURL=Plugin.d.ts.map