import { ChannelType } from '../..';
import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'channelType',
            enableByDefault: true,
        });
    }
    run({ command, guild, channel }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.channelType[0]) {
            if (!command.channelType.includes(ChannelType[channel.type])) return false;
        }
        return true;
    }
}
