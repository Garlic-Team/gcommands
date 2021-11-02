import { ChannelType } from '../..';
import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'channelTypeOnly',
            enableByDefault: true,
        });
    }
    run({ command, guild, channel }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.channelTypeOnly[0]) {
            if (!command.channelTypeOnly.includes(ChannelType[channel.type])) return false;
        }
        return true;
    }
}
