import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

class UserArgumentType extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'USER');
    }

	validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'user');
        this.value.value = matches[0];

		const user = this.client.users.cache.get(matches[0]);
		if (!user) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'user');
        else this.value.user = user;

        const member = message.guild.members.cache.get(matches[0]);
        if (member) this.value.member = member;
    }

    resolve(option) {
        if (this.value.user) option.user = this.value.user;
        if (this.value.member) option.member = this.value.member;

        return option;
    }
}

module.exports = UserArgumentType;
