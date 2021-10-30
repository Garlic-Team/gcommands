import { ClientOptions } from 'discord.js';

import { LanguageType, CommandType } from '../util/Constants';

export interface GCommandsClientOptions extends ClientOptions {
    language: LanguageType;
    loader: {
      cmdDir: string;
      eventDir?: string;
      componentDir?: string
      autoCategory?: boolean;
    }
    arguments?: {
      deletePrompt?: boolean;
      deleteInput?: boolean;
      wait?: number;
    }
    commands?: {
      defaultType?: Array<CommandType>;
      prefix?: string;
      loadFromCache?: boolean;
    },
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
    ownLanguageFile?: object;
}
