/* eslint-disable no-unused-vars */
import { Client, Collection } from 'discord.js';
import * as Keyv from '@keyvhq/core';
import { GComponents } from '@gcommands/components';

import { GCommandsClientOptions } from '../typings/interfaces';
import { GCommandsClientOptionsDefaults } from '../typings/defaults';
import { GCommandsDispatcher } from './GCommandsDispatcher';
import { GDatabaseLoader } from '../managers/GDatabaseLoader';
import { Command } from '../structures/Command';
import { GGuild } from '../structures/GGuild';
import { GCommandLoader } from '../managers/GCommandLoader';

export class GCommandsClient extends Client {
    public commands: Collection<string, Command>;
    public aliases: Collection<string, string>;
    public languageFile: Record<string, Record<string, string>>;
    public options: GCommandsClientOptions;
    public dispatcher: GCommandsDispatcher;
    public database: Keyv | null;

    public constructor(options: GCommandsClientOptions) {
        super(Object.assign(GCommandsClientOptionsDefaults, options));

        this.commands = new Collection();
        this.aliases = new Collection();
        this.dispatcher = new GCommandsDispatcher(this);

        new GDatabaseLoader(this);

        setImmediate(() => {
            super.on('ready', () => {
                this.loadSys();
            });
        });
    }
    private loadSys(): void {
        new GGuild();

        setTimeout(async () => {
            if (!this.options.ownLanguageFile) this.languageFile = await import('../util/message.json');
            else this.languageFile = this.options.ownLanguageFile;
            // New GEventHandling(this);
            // if (this.eventDir) new GEventLoader(this);
            if (this.options.loader.componentDir) new GComponents(this, { dir: this.options.loader.componentDir });
            new GCommandLoader(this);
        }, 1000);
    }
}
