import { Client, ClientOptions } from 'discord.js';
export declare enum AutoDeferType {
    'EPHEMERAL' = 1,
    'NORMAL' = 2,
    'UPDATE' = 3
}
export interface GClientOptions extends ClientOptions {
    messageSupport?: boolean;
    messagePrefix?: string;
    unknownCommandMessage?: boolean;
    dirs?: Array<string>;
    database?: any;
    devGuildId?: string;
}
export declare class GClient<Ready extends boolean = boolean> extends Client<Ready> {
    responses: Record<string, string>;
    options: GClientOptions;
    constructor(options: GClientOptions);
    login(token?: string): Promise<string>;
}
//# sourceMappingURL=GClient.d.ts.map