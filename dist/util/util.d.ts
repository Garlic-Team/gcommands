import { GCommandsClient } from '../base/GCommandsClient';
declare class Util {
    static isClass(input: unknown): boolean;
    static resolveString(input: unknown): string;
    static getAllObjects(client: GCommandsClient, ob: object): void;
    static resolveMessageOptions(options: any): any;
    static inhibit(client: any, data: () => boolean): any;
    static comparable(o: any): any;
    static unescape(a: string, b?: string, c?: string): string;
    static __deleteCmd(client: any, commandId: number, guildId?: any): Promise<any>;
    static __getAllCommands(client: any, guildId?: any): Promise<any>;
}
export default Util;
