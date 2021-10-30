import { Intents } from 'discord.js';

import { LanguageType } from '../util/Constants';

export const GCommandsClientOptionsDefaults = {
    language: LanguageType.ENGLISH,
    loader: {
      cmdDir: undefined,
      eventDir: undefined,
      componentDir: undefined,
      autoCategory: false,
    },
    arguments: {
      deletePrompt: false,
      deleteInput: false,
      wait: 30000,
    },
    commands: {
      defaultType: [],
      prefix: undefined,
      loadFromCache: true,
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
  cooldown: undefined,
  args: undefined,
  alwaysObtain: false,
  clientRequiredPermissions: undefined,
  userRequiredPermissions: undefined,
  userRequiredRoles: undefined,
  userOnly: undefined,
  channelTypeOnly: undefined,
  allowDm: false,
  guildOnly: undefined,
  nsfw: false,
  aliases: undefined,
  category: undefined,
  usage: undefined,
};
