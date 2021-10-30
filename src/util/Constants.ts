/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export enum LanguageType {
    ENGLISH = 'english',
    SPANISH = 'spanish',
    PORTUGUESE = 'portuguese',
    RUSSIAN = 'russian',
    GERMAN = 'german',
    CZECH = 'czech',
    SLOVAK = 'slovak',
    TURKISH = 'turkish',
    POLISH = 'polish',
    INDONESIAN = 'indonesian',
    ITALIAN = 'italian',
    FRENCH = 'french',
}

export enum CommandType {
    MESSAGE = 'MESSAGE',
    SLASH = 'SLASH',
    MESSAGE_CONTEXT_MENU = 'MESSAGE_CONTEXT_MENU',
    USER_CONTEXT_MENU = 'USER_CONTEXT_MENU',
}

export enum InternalEvents {
    DEBUG = 'debug',
    LOG = 'log',
    COMMAND_EXECUTE = 'commandExecute',
    COMMAND_ERROR = 'commandError',
    COMMANDS_LOADED = 'commandsLoaded',
    COMMAND_NOT_FOUND = 'commandNotFound',
}

export enum ArgumentType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTIGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}

export enum ChannelType {
    DM = 'DM',
    GUILD_TEXT = 'GUILD_TEXT',
    GUILD_NEWS = 'GUILD_NEWS',
    GUILD_NEWS_THREAD = 'GUILD_NEWS_THREAD',
    GUILD_PUBLIC_THREAD = 'GUILD_PUBLIC_THREAD',
    GUILD_PRIVATE_THREAD = 'GUILD_PRIVATE_THREAD',
}
