import { GCommandsClient } from '../../base/GCommandsClient';
import { InhibitorRunOptions } from '../../typings/types';
import { Inhibitor } from '../Inhibitor';

export default class extends Inhibitor {
    constructor(client: GCommandsClient) {
        super(client, {
            name: 'userRequiredRoles',
            enableByDefault: true,
        });
    }
    run({ respond, command, guild, member, language }: InhibitorRunOptions) {
        if (!guild) return false;
        if (command.userRequiredRoles[0]) {
            const roles = command.userRequiredRoles.some(r => member.roles.cache.has(r));
            if (!roles) {
                return respond(
                    this.client.languageFile.MISSING_ROLES[language].replace('{ROLES}', `\`${command.userRequiredRoles.map(r => guild.roles.cache.get(r).name).join(', ')}\``),
                );
            }
        }
        return true;
    }
}
