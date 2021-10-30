import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';


export class IntegerArgumentType extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'INTEGER');
    }

	validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
		if (!parseInt(message.content) || (parseInt(message.content) % 1 !== 0)) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'integer');

        const choice = argument.choices?.find(ch => ch.name === message.content);
		if (argument.choices && !choice) return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', '));
        else if (argument.choices) this.value.value = choice.value;
        else this.value.value = parseInt(message.content);
    }
}
