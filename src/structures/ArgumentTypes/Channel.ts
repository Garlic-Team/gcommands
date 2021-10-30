import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { ChannelType, LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

export class ChannelArgument extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'CHANNEL');
    }

	Validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
		const matches = message.content.match(/([0-9]+)/);

		if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
        this.value.value = matches[0];

		const channel = this.client.channels.cache.get(matches[0]);
		if (!channel) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
        else this.value.channel = channel;
        if (argument.channel_types && argument.channel_types.some(type => type !== ChannelType[channel.type])) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'channel');
	}
    resolve(option) {
        if (this.value.channel) option.channel = this.value.channel;

        return option;
    }
}

// Fix this later!
