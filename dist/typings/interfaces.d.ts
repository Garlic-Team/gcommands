import { ClientOptions, Snowflake, PermissionResolvable, TextBasedChannelTypes } from 'discord.js';
import { LanguageType, CommandType } from '../util/Constants';
export interface GCommandsClientOptions extends ClientOptions {
    language: LanguageType;
    loader: {
        cmdDir: string;
        eventDir?: string;
        componentDir?: string;
        autoCategory?: boolean;
        loadFromCache?: boolean;
    };
    arguments?: {
        deletePrompt?: boolean;
        deleteInput?: boolean;
        wait?: number;
    };
    commands?: {
        defaultType?: Array<CommandType>;
        prefix?: string;
    };
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
    ownLanguageFile?: object;
}
export interface CommandOptions {
    name: string;
    contextMenuName?: string;
    description: string;
    type: Array<CommandType>;
    cooldown?: string;
    args?: Array<boolean>;
    alwaysObtain?: boolean;
    clientRequiredPermissions?: PermissionResolvable | Array<PermissionResolvable>;
    userRequiredPermissions?: PermissionResolvable | Array<PermissionResolvable>;
    userRequiredRoles?: Snowflake | Array<Snowflake>;
    userOnly?: Snowflake | Array<Snowflake>;
    channelTypeOnly?: TextBasedChannelTypes | Array<TextBasedChannelTypes>;
    allowDm?: boolean;
    guildOnly?: Snowflake | Array<Snowflake>;
    nsfw?: boolean;
    aliases?: Array<string>;
    category?: string;
    usage?: string;
}
