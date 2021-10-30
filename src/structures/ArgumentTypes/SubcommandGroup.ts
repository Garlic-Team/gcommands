import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

export class SubCommandGroupArgumentType extends BaseArgument {
    constructor(client: GCommandsClient) {
        super(client, 'SUB_COMMAND_GROUP');
    }

    validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
        const subcommand = argument.subcommands?.find(sc => sc.name === message.content);
        if (argument.subcommands && !subcommand) return this.client.languageFile.ARGS_COMMAND[language].replace('{choices}', argument.subcommands.map(sc => `\`${sc.name}\``).join(', '));
        else this.value.value = subcommand;
    }
}

module.exports = SubCommandGroupArgumentType;
