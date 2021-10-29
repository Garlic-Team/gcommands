import { Client, Collection } from 'discord.js';
import { GCommandsClientOptions } from '../types/types';
import { GCommandsDispatcher } from './GCommandsDispatcher';
export declare class GCommandsClient extends Client {
    commands: Collection<string, object>;
    aliases: Collection<string, string>;
    languageFile: object;
    options: GCommandsClientOptions;
    dispatcher: GCommandsDispatcher;
    constructor(options: GCommandsClientOptions);
}
