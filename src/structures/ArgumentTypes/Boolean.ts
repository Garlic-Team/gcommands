import { Guild } from 'discord.js';
import { GCommandsClient } from '../../base/GCommandsClient';
import { LanguageType } from '../../util/Constants';
import { BaseArgument } from './Base';

export class BooleanArgument extends BaseArgument {
    private trueAnswerSet: Set<string>;
    private falseAnswerSet: Set<string>;

    constructor(client: GCommandsClient) {
        super(client, 'BOOLEAN');
        this.trueAnswerSet = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled']);
        this.falseAnswerSet = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled']);
    }

    validate(argument, message: { content: string, guild: Guild }, language: LanguageType) {
        if (this.trueAnswerSet.has(message.content) === false && this.falseAnswerSet.has(message.content) === false) {
            return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'boolean');
        } else if (this.falseAnswerSet.has(message.content)) {
            this.value.value = false;
        } else if (this.trueAnswerSet.has(message.content)) {
            this.value.value = true;
        }
    }
}
