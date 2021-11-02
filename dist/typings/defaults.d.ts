import { LanguageType } from '../util/Constants';
export declare const GCommandsClientOptionsDefaults: {
    language: LanguageType;
    loader: {
        cmdDir: any;
        eventDir: any;
        inhibitorDir: any;
        componentDir: any;
        autoCategory: boolean;
        loadFromCache: boolean;
    };
    arguments: {
        deletePrompt: boolean;
        deleteInput: boolean;
        wait: number;
        addSkipToPrompt: boolean;
        promptIfSkippable: boolean;
    };
    commands: {
        defaultType: any[];
        prefix: any;
        allowDm: boolean;
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
    inhibitors: any[];
    cooldown: any;
    args: any;
    alwaysObtain: boolean;
    clientRequiredPermissions: any[];
    userRequiredPermissions: any[];
    userRequiredRoles: any[];
    userOnly: any[];
    channelType: any[];
    allowDm: boolean;
    guildOnly: any[];
    nsfw: boolean;
    aliases: any;
    category: any;
    usage: any;
};
export declare const InhibitorOptionsDefaults: {
    name: string;
    enableByDefault: boolean;
};
