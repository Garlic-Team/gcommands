import { Intents } from 'discord.js';

import { LanguageType } from '../util/Constants';
import { GError } from '../structures/GError';

export const GCommandsClientOptionsDefaults = {
    language: LanguageType.ENGLISH,
    loader: {
        cmdDir: undefined,
        eventDir: undefined,
        inhibitorDir: undefined,
        componentDir: undefined,
        autoCategory: false,
        loadFromCache: true,
    },
    arguments: {
        deletePrompt: false,
        deleteInput: false,
        wait: 30000,
        addSkipToPrompt: false,
        promptIfSkippable: false,
    },
    commands: {
        defaultType: [],
        prefix: undefined,
        allowDm: false,
    },
    caseSensitiveCommands: false,
    caseSensitivePrefixes: false,
    defaultCooldown: '5s',
    database: undefined,
    ownLanguageFile: undefined,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
};

export const CommandOptionsDefaults = {
    name: 'undefined',
    contextMenuName: undefined,
    description: 'undefined',
    type: [],
    inhibitors: [],
    cooldown: undefined,
    args: undefined,
    alwaysObtain: false,
    clientRequiredPermissions: [],
    userRequiredPermissions: [],
    userRequiredRoles: [],
    userOnly: [],
    channelType: [],
    allowDm: false,
    guildOnly: [],
    nsfw: false,
    aliases: undefined,
    category: undefined,
    usage: undefined,
    run: () => {
        throw new GError('[COMMAND]', 'Commands must provide a run function');
    },
};

export const InhibitorOptionsDefaults = {
    name: 'undefined',
    enableByDefault: false,
};
