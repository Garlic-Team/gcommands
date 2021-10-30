import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

export class StringArgument extends BaseArgument {
    /**
     * The StringArgumentType class
     */
    constructor(client: GCommandsClient) {
        super(client, 'STRING');
    }

	validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
        const choice = argument.choices?.find(ch => ch.name.toLowerCase() === message.content);
        if (argument.choices && !choice) return this.client.languageFile.ARGS_CHOICES[language].replace('{choices}', argument.choices.map(opt => `\`${opt.name}\``).join(', '));
        else if (choice) this.value.value = choice.value;
        else this.value.value = message.content;
    }
}
