import { Guild } from 'discord.js';

import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { GError } from '../GError';

export class BaseArgument {
    protected client: GCommandsClient;
    public type: string;
    public value: Record<string, unknown>;

    public constructor(client: GCommandsClient, type: string) {
        this.type = type;
        this.client = client;
        this.value = {};

        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(argument, message: { content: string, guild: Guild }, language: LanguageType) { // eslint-disable-line no-unused-vars, require-await
        throw new GError('[ARGUMENTS]', 'Argument doesnt have provided validate() method');
    }

    public get() { // eslint-disable-line no-unused-vars, require-await
        return this.value?.value;
    }

    public resolve(option: Record<string, unknown>) {
        return option;
    }
}
