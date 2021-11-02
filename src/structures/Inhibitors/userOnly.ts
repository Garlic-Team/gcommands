import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'userOnly',
            enableByDefault: true,
        });
    }
    run({ command, author }: InhibitorRunOptions) {
        if (command.userOnly[0]) {
            if (!command.userOnly.includes(author.id)) return false;
        }
        return true;
    }
}
