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

    constructor(client: GCommandsClient, options: InhibitorOptions) {
        this.client = client;

        Object.assign(this, Object.assign(InhibitorOptionsDefaults, options));
    }
    
    run(options: InhibitorRunOptions): boolean | unknown | Promise<boolean | unknown> {
        throw new GError('[INHIBITOR]',`Inhibitor ${this.name} doesn't provide a run method!`);
    }
}
