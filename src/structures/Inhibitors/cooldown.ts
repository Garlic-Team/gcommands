import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'cooldown',
            enableByDefault: true,
        });
    }
    async run({ respond, command, author, guild, language }: InhibitorRunOptions) {
        const cooldown = await this.client.dispatcher.getCooldown(author.id, guild, command);

        if (cooldown?.cooldown) {
            return respond(
                this.client.languageFile.COOLDOWN[language].replace(/{COOLDOWN}/g, cooldown.wait).replace(/{CMDNAME}/g, command.name),
            );
        }

        return true;
    }
}
