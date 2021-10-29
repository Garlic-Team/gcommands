import { ClientOptions } from 'discord.js';

import { GuildLanguageTypes, GCommandsOptionsCommandsSlash, GCommandsOptionsCommandsContext } from './types';

export interface GCommandsClientOptions extends ClientOptions {
    language: GuildLanguageTypes;
    loader: {
      cmdDir: string;
      eventDir?: string;
      autoCategory?: boolean;
    }
    arguments?: {
      deletePrompt?: boolean;
      deleteInput?: boolean;
      wait?: number;
    }
    commands?: {
      slash?: GCommandsOptionsCommandsSlash;
      context?: GCommandsOptionsCommandsContext;
      prefix?: string;
      loadFromCache?: boolean;
    },
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
    ownLanguageFile?: object;
}
