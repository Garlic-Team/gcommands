import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'guildOnly',
            enableByDefault: true,
        });
    }
    run({ command, guild }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.guildOnly[0]) {
            if (!command.guildOnly.includes(guild.id)) return false;
        }
        return true;
    }
}
