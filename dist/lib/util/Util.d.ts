import type { Client } from 'discord.js';
import type { GClient } from '../GClient';
export declare class Util {
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
     */
    static argumentsToArray(options: Array<any>): Array<string>;
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
     */
    static argumentsToObject(options: Array<any>): {};
    /**
     * @deprecated We don't support arguments in object/array
     * @link https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
    */
    static checkIfSubOrGroup(type: string): boolean;
    static isClass(input: any): boolean;
    static resolveArgumentOptions(options: any): any;
    static resolveFile(file: any, fileType: string): any;
    static stringToBoolean(string: string): boolean;
    static resolveValidationErrorTrace(array: Array<any>): string;
    static pad(number: number): string;
    static throwError(error: any, name: any): void;
    static toPascalCase(input: string): string;
    static getResponse(value: string, interaction: {
        client: Client | GClient;
    }): Promise<string>;
}
//# sourceMappingURL=Util.d.ts.map