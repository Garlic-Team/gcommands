import { Client, Collection } from 'discord.js';
import * as Keyv from '@keyvhq/core';

import { GCommandsClientOptions } from '../typings/interfaces';
import { GCommandsDispatcher } from './GCommandsDispatcher';
import { GDatabaseLoader } from '../managers/GDatabaseLoader';

export class GCommandsClient extends Client {
    public commands: Collection<string, object>;
    public aliases: Collection<string, string>;
    public languageFile: object;
    public options: GCommandsClientOptions;
    public dispatcher: GCommandsDispatcher;
    public database: Keyv;

    public constructor(options: GCommandsClientOptions) {
        super(options);

        if (!this.options.ownLanguageFile) this.languageFile = import('../util/message.json');
        else this.languageFile = this.options.ownLanguageFile;

        this.commands = new Collection();
        this.aliases = new Collection();
        this.dispatcher = new GCommandsDispatcher(this);

        new GDatabaseLoader(this);
    }
}
