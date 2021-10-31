import { Intents } from 'discord.js';

import { LanguageType } from '../util/Constants';

export const GCommandsClientOptionsDefaults = {
    language: LanguageType.ENGLISH,
    loader: {
      cmdDir: undefined,
      eventDir: undefined,
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
};
