import { ClientOptions, Snowflake, PermissionResolvable } from 'discord.js';

import { LanguageType, CommandType, ChannelType } from '../util/Constants';

export interface GCommandsClientOptions extends ClientOptions {
    language: LanguageType;
    loader: {
      cmdDir: string;
      eventDir?: string;
      componentDir?: string
      autoCategory?: boolean;
      loadFromCache?: boolean;
    }
    arguments?: {
      deletePrompt?: boolean;
      deleteInput?: boolean;
      wait?: number;
      addSkipToPrompt?: boolean;
      promptIfSkippable?: boolean;
    }
    commands?: {
      defaultType?: Array<CommandType>;
      prefix?: string;
    },
    caseSensitiveCommands?: boolean;
    caseSensitivePrefixes?: boolean;
    defaultCooldown?: string;
    database?: string;
    ownLanguageFile?: Record<string, Record<string, string>>;
}

export interface CommandOptions {
  name: string;
  contextMenuName?: string;
  description: string;
  type: Array<CommandType>;
  cooldown?: string;
  args?: Array<boolean>;
  alwaysObtain?: boolean;
  clientRequiredPermissions?: Array<PermissionResolvable>;
  userRequiredPermissions?: Array<PermissionResolvable>;
  userRequiredRoles?: Array<Snowflake>;
  userOnly?: Array<Snowflake>;
  channelTypeOnly?: Array<ChannelType>
  allowDm?: boolean;
  guildOnly?: Array<Snowflake>;
  nsfw?: boolean;
  aliases?: Array<string>;
  category?: string;
  usage?: string;
}
