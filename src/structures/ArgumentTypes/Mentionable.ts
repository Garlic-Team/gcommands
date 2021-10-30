import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

export class MentionableArgument extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'MENTIONABLE');
    }

	validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
		const matches = message.content.match(/([0-9]+)/);
		if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'mention');
        this.value.value = matches[0];

		const role = message.guild.roles.cache.get(matches[0]);
		const user = this.client.users.cache.get(matches[0]);
        const member = message.guild.members.cache.get(matches[0]);
		if (!user && !role && !member) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'mention');

        if (role) this.value.role = role;
        if (user) this.value.user = user;
        if (member) this.value.member = member;
	}
}
