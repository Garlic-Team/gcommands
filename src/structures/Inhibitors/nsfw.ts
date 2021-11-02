import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'nsfw',
            enableByDefault: true,
        });
    }
    run({ respond, command, guild, channel, language }: InhibitorRunOptions) {
        if (!guild) return false;
        if (channel.nsfw && command.nsfw) return respond(this.client.languageFile.NSFW[language]);
        return true;
    }
}
