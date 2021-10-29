import { Client, Collection } from 'discord.js';

import { GCommandsClientOptions } from '../types/types';

export class GCommandsClient extends Client {
    public commands: Collection<string, object>;
    public aliases: Collection<string, string>;
    public languageFile: object;
    public options: GCommandsClientOptions;

    constructor(options: GCommandsClientOptions) {
        super(options);

        if (!this.options.ownLanguageFile) this.languageFile = import('../util/message.json');
        else this.languageFile = this.options.ownLanguageFile;

        this.commands = new Collection();
        this.aliases = new Collection();
    }
}
