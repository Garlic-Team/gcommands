import * as Keyv from '@keyvhq/core';

import { GCommandsClient } from '../base/GCommandsClient';
import { GError } from '../structures/GError';

export class GDatabaseLoader {
    private client: GCommandsClient;

    public constructor(client: GCommandsClient) {
        this.client = client;

        this.load();
    }
    private load(): void {
        const store = this.client.options.database;
        if (typeof store === 'object') {
            try {
                this.client.database = new Keyv({ store: store });
            } catch (err) {
                throw new GError('[DATABASE]', err);
            }
        }
    }
}
