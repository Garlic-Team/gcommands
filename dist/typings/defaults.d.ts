import { LanguageType } from '../util/Constants';
export declare const GCommandsClientOptionsDefaults: {
    language: LanguageType;
    loader: {
        cmdDir: any;
        eventDir: any;
        componentDir: any;
        autoCategory: boolean;
        loadFromCache: boolean;
    };
    arguments: {
        deletePrompt: boolean;
        deleteInput: boolean;
        wait: number;
    };
    commands: {
        defaultType: any[];
        prefix: any;
    };
    caseSensitiveCommands: boolean;
    caseSensitivePrefixes: boolean;
    defaultCooldown: string;
    database: any;
    ownLanguageFile: any;
    intents: number[];
};
export declare const CommandOptionsDefaults: {
    name: string;
    contextMenuName: any;
    description: string;
    type: any[];
    cooldown: any;
    args: any;
    alwaysObtain: boolean;
    clientRequiredPermissions: any;
    userRequiredPermissions: any;
    userRequiredRoles: any;
    userOnly: any;
    channelTypeOnly: any;
    allowDm: boolean;
    guildOnly: any;
    nsfw: boolean;
    aliases: any;
    category: any;
    usage: any;
};
