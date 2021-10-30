import { Client, Collection } from 'discord.js';
import * as Keyv from '@keyvhq/core';
import { GCommandsClientOptions } from '../typings/interfaces';
import { GCommandsDispatcher } from './GCommandsDispatcher';
import { Command } from '../structures/Command';
export declare class GCommandsClient extends Client {
    commands: Collection<string, Command>;
    aliases: Collection<string, string>;
    languageFile: object;
    options: GCommandsClientOptions;
    dispatcher: GCommandsDispatcher;
    database: Keyv;
    constructor(options: GCommandsClientOptions);
    private loadSys;
}
