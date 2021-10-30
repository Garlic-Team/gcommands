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
    MESSAGE = 'message',
    SLASH = 'slash',
    MESSAGE_CONTEXT_MENU = 'message_context_menu',
    USER_CONTEXT_MENU = 'user_context_menu',
}

export enum InternalEvents {
    DEBUG = 'debug',
    LOG = 'log',
    COMMAND_EXECUTE = 'commandExecute',
    COMMAND_ERROR = 'commandError',
    COMMANDS_LOADED = 'commandsLoaded',
    COMMAND_NOT_FOUND = 'commandNotFound',
}
