import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';


export class RoleArgument extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'ROLE');
    }

    validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
        const matches = message.content.match(/([0-9]+)/);

        if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');
        this.value.value = matches[0];

        const role = message.guild.roles.cache.get(matches[1]);
        if (!role) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');
        else this.value.role = role;
    }
    resolve(option) {
        if (this.value.role) option.role = this.value.role;

        return option;
    }
}
