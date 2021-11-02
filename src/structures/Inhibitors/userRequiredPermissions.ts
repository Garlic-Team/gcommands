import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';
import Util from '../../util/util';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'userRequiredPermissions',
            enableByDefault: true,
        });
    }
    run({ respond, command, member, guild, language }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.userRequiredPermissions[0]) {
            if (!member.permissions.has(command.userRequiredPermissions)) {
                return respond(
                    this.client.languageFile.MISSING_PERMISSIONS[language].replace('{PERMISSION}', command.userRequiredPermissions.map(v => Util.unescape(String(v), '_')).join(', ')),
                );
            }
        }
        return true;
    }
}
