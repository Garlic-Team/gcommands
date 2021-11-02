import { Client, Collection } from 'discord.js';
import * as Keyv from '@keyvhq/core';
import { GCommandsClientOptions } from '../typings/interfaces';
import { GCommandsDispatcher } from './GCommandsDispatcher';
import { Command } from '../structures/Command';
import { Inhibitor } from '../structures/Inhibitor';
export declare class GCommandsClient extends Client {
    gcommands: Collection<string, Command>;
    galiases: Collection<string, string>;
    ginhibitors: Collection<string, Inhibitor>;
    languageFile: Record<string, Record<string, string>>;
    options: GCommandsClientOptions;
    dispatcher: GCommandsDispatcher;
    database: Keyv | null;
    _applicationCommandsCache: Array<unknown>;
    constructor(options: GCommandsClientOptions);
    private loadSys;
}
