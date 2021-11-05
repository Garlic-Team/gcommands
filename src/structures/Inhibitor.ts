/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { GCommandsClient } from '../base/GCommandsClient';
import { InhibitorOptions } from '../typings/interfaces';
import { InhibitorOptionsDefaults } from '../typings/defaults';
import { InhibitorRunOptions } from '../typings/types';
import { GError } from './GError';

export class Inhibitor {
    readonly client: GCommandsClient;
    readonly name: string;
    readonly enableByDefault: boolean;
    private path: string;

    public constructor(client: GCommandsClient, options: InhibitorOptions) {
        this.client = client;

        Object.assign(this, Object.assign(InhibitorOptionsDefaults, options));
    }

    public run(options: InhibitorRunOptions): boolean | unknown | Promise<boolean | unknown> {
        throw new GError('[INHIBITOR]',`Inhibitor ${this.name} doesn't provide a run method!`);
    }

    public async reload(): Promise<boolean> {
        const cmdPath = this.client.ginhibitors.get(this.name).path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.ginhibitors.delete(this.name);

        let newInhibitor = await require(cmdPath);

        newInhibitor = new newInhibitor(this.client);

        newInhibitor.path = cmdPath;
        this.client.ginhibitors.set(newInhibitor.name, newInhibitor);
        return true;
    }
}
