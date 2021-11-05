import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';
import Util from '../../util/util';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'clientRequiredPermissions',
            enableByDefault: true,
        });
    }
    run({ respond, command, guild, channel, language }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.clientRequiredPermissions[0]) {
            if (!channel.permissionsFor(guild.me).has(command.clientRequiredPermissions)) {
                return respond(
                    this.client.languageFile.MISSING_CLIENT_PERMISSIONS[language].replace('{PERMISSION}', command.clientRequiredPermissions.map(v => Util.unescape(String(v), '_')).join(', ')),
                );
            }
        }
        return true;
    }
}
