import { ClientOptions } from 'discord.js';
export interface GCommandsClientOptions extends ClientOptions {
    language: GuildLanguageTypes;
    loader: {
        cmdDir: string;
        eventDir?: string;
        autoCategory?: boolean;
    };
    arguments?: {
        deletePrompt?: boolean;
        deleteInput?: boolean;
        wait?: number;
    };
    commands?: {
        slash?: GCommandsOptionsCommandsSlash;
        context?: GCommandsOptionsCommandsContext;
        prefix?: string;
        loadFromCache?: boolean;
    };
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
    ownLanguageFile?: object;
}
export declare type GuildLanguageTypes = 'english' | 'spanish' | 'portuguese' | 'russian' | 'german' | 'czech' | 'slovak' | 'turkish' | 'polish' | 'indonesian' | 'italian' | 'french';
export declare type GCommandsOptionsCommandsSlash = 'both' | 'slash' | 'message' | 'false';
export declare type GCommandsOptionsCommandsContext = 'both' | 'user' | 'message' | 'false';
