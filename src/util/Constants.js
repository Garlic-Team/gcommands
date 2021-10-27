/**
 * Emitted for general debugging information.
 * @event GCommandsClient#debug
 * @param {string} info The message that was emitted.
 * @example client.on('debug', (info) => { console.log(info); });
*/

/**
 * Emitted for command loading/deletion
 * @event GCommandsClient#log
 * @param {string} info The message that was emitted.
 * @example client.on('log', (info) => { console.log(info); });
*/

/**
 * Emitted when a command executes
 * @event GCommandsClient#commandExecute
 * @param {string} info Running the command.
 * @example client.on('commandExecute', (info) => { console.log(info); });
*/

/**
 * Emitted when a error occurs inside a command
 * @event GCommandsClient#commandError
 * @param {string} info Error from command
 * @example client.on('commandError', (info) => { console.log(info); });
*/

/**
 * Emitted when all commands are loaded
 * @event GCommandsClient#commandsLoaded
 * @param {string} info All commands loaded
 * @example client.on('commandsLoaded', (info) => { console.log(info); });
*/

/**
 * Emitted when a command is not found
 * @event GCommandsClient#commandNotFound
 * @param {string} info Command not found
 * @example client.on('commandNotFound', (info) => { console.log(info); });
*/

/**
 * Events
 * * debug
 * * log
 * * commandExecute
 * * commandError
 * * commandsLoaded
 * * commandNotFound
 * @type {Object}
 */
exports.Events = {
    DEBUG: 'debug',
    LOG: 'log',
    COMMAND_EXECUTE: 'commandExecute',
    COMMAND_ERROR: 'commandError',
    COMMANDS_LOADED: 'commandsLoaded',
    COMMAND_NOT_FOUND: 'commandNotFound',
};

/**
 * ArgumentType
 * * SUB_COMMAND
 * * SUB_COMMAND_GROUP
 * * STRING
 * * INTEGER
 * * BOOLEAN
 * * USER
 * * CHANNEL
 * * ROLE
 * * MENTIONABLE
 * * NUMBER
 * @typedef {(string)} ArgumentType
 */
exports.ArgumentType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
};

/**
 * The GCommandsOptions
 * @property {GCommandsOptionsLanguage} language
 * @property {GCommandsOptionsCommands} commands
 * @property {GCommandsOptionsArguments} arguments
 * @property {GCommandsOptionsLoader} loader
 * @property {boolean} caseSensitiveCommands
 * @property {boolean} caseSensitivePrefixes
 * @property {string} defaultCooldown
 * @property {string} database
 * @typedef {(object)} GCommandsOptions
 */

/**
 * The GCommandsOptionsLanguage
 * * english
 * * spanish
 * * portuguese
 * * russian
 * * german
 * * czech
 * * slovak
 * * turkish
 * * polish
 * * indonesian
 * * italian
 * * french
 * @typedef {(string)} GCommandsOptionsLanguage
 */

/**
 * The GCommandsOptionsCommandsContext
 * * both
 * * user
 * * message
 * * false
 * @typedef {(string | boolean)} GCommandsOptionsCommandsContext
 */

/**
 * The GCommandsOptionsCommandsSlash
 * * both
 * * slash
 * * message
 * * false
 * @typedef {(string | boolean)} GCommandsOptionsCommandsSlash
 */

/**
 * The GCommandsOptionsCommands
 * @property {GCommandsOptionsCommandsSlash} slash
 * @property {GCommandsOptionsCommandsContext} context
 * @property {string} prefix
 * @property {boolean} loadFromCache
 * @typedef {(object)} GCommandsOptionsCommands
 */

/**
 * The GCommandsOptionsArguments
 * @property {boolean} deletePrompt
 * @property {boolean} deleteInput
 * @typedef {(object)} GCommandsOptionsArguments
 */

/**
 * The GCommandsOptionsLoader
 * @property {string} cmdDir
 * @property {string} eventDir
 * @property {boolean} autoCategory
 * @typedef {(object)} GCommandsOptionsLoader
 */

/**
 * The CommandRunOptions
 * @property {Client} client
 * @property {GInteraction} interaction
 * @property {GuildMember} member
 * @property {Message | undefined} message
 * @property {Guild} guild
 * @property {TextChannel | NewsChannel} channel
 * @property {string | GPayloadOptions} respond
 * @property {string | GPayloadOptions} edit
 * @property {string | GPayloadOptions} followUp
 * @property {Object} args
 * @property {string} language
 * @typedef {(Object)} CommandRunOptions
*/

/**
 * The Inhibitor
 * <info>You can see <a href='https://gcommands.js.org/guide/guide/miscellaneous/inhibitor.html'>guide</a> to get a better idea of how inhibitors work.</info>
 *
 * @property {GInteraction} interaction
 * @property {Message} message
 * @property {GuildMember} member
 * @property {Guild} guild
 * @property {TextChannel | NewsChannel} channel
 * @property {string | GPayloadOptions} respond
 * @property {string | GPayloadOptions} edit
 * @property {string | GPayloadOptions} followUp
 * @property {string} language
 * @typedef {(Object)} Inhibitor
 */

/**
 * Base options provided when sending.
 * <info>You can also see [discord.js docs](https://discord.js.org/#/docs/main/stable/typedef/MessageOptions) for more info.</info>
 *
 * @typedef {Object} GPayloadOptions
 * @property {boolean} [tts=false]
 * @property {string} [nonce='']
 * @property {string} [content='']
 * @property {boolean} [ephemeral=false]
 * @property {boolean|string} [inlineReply]
 * @property {MessageEmbed[]} [embeds]
 * @property {MessageMentionOptions} [allowedMentions]
 * @property {FileOptions[]|BufferResolvable[]|MessageAttachment[]} [files]
 * @property {MessageActionRow[]|MessageActionRowOptions[]} [components]
 * @property {StickerResolvable[]} [stickers]
 * @property {MessageAttachment[]} [attachments]
 */

/**
 * The CommandOptions
 * <info>`channelThreadOnly` is only for d.js v13</info>
 *
 * @property {string} name
 * @property {string} description
 * @property {string} cooldown
 * @property {string} category
 * @property {Array} args
 * @property {Array} aliases
 * @property {string | Array} userRequiredPermissions
 * @property {string | Array} userRequiredRoles
 * @property {string | Array} clientRequiredPermissions
 * @property {Snowflake | Array} userOnly
 * @property {Snowflake | Array} channelOnly
 * @property {Snowflake | Array} guildOnly
 * @property {boolean} channelTextOnly
 * @property {boolean} channelNewsOnly
 * @property {boolean} channelThreadOnly
 * @property {boolean} nsfw
 * @property {GCommandsOptionsCommandsSlash} slash
 * @property {GCommandsOptionsCommandsContext} context
 * @typedef {(Object)} CommandOptions
 */

/**
 * The CommandArgsOption
 *
 * @property {string} name
 * @property {string} description
 * @property {ArgumentType} type
 * @property {string} prompt
 * @property {boolean} required
 * @property {CommandArgsChoice[]} choices
 * @property {CommandArgsOption} options
 * @typedef {(Object)} CommandArgsOption
 */

/**
 * The CommandArgsChoices
 *
 * @property {string} name
 * @property {string} value
 * @typedef {(Object)} CommandArgsChoice
 */

/**
 * ArgumentChannelTypes
 *
 * * DM
 * * GUILD_TEXT
 * * GUILD_VOICE
 * * GUILD_CATEGORY
 * * GUILD_NEWS
 * * GUILD_STORE
 * * GUILD_NEWS_THREAD
 * * GUILD_PUBLIC_THREAD
 * * GUILD_PRIVATE_THREAD
 * * GUILD_STAGE_VOICE
 * @typedef {(string)} ArgumentChannelTypes
 */
module.exports.ArgumentChannelTypes = {
    DM: 1,
    GUILD_TEXT: 0,
    GUILD_VOICE: 2,
    GUILD_CATEGORY: 4,
    GUILD_NEWS: 5,
    GUILD_STORE: 6,
    GUILD_NEWS_THREAD: 10,
    GUILD_PUBLIC_THREAD: 11,
    GUILD_PRIVATE_THREAD: 12,
    GUILD_STAGE_VOICE: 13,
};

/**
 * The type of an {@link ApplicationCommand} object:
 * * CHAT_INPUT
 * * USER
 * * MESSAGE
 * @typedef {string} ApplicationCommandType
 */
 exports.ApplicationCommandTypes = createEnum([null, 'CHAT_INPUT', 'USER', 'MESSAGE']);
 exports.ApplicationCommandTypesRaw = {
    user: 2,
    message: 3,
    both: 4,
 };

/**
 * The type of an {@link GInteraction} object:
 * * PING
 * * APPLICATION_COMMAND
 * * MESSAGE_COMPONENT
 * @typedef {string} GInteractionType
 */
 exports.InteractionTypes = createEnum([null, 'PING', 'APPLICATION_COMMAND', 'MESSAGE_COMPONENT']);

/**
 * The type of a message component
 * * ACTION_ROW
 * * BUTTON
 * * SELECT_MENU
 * @typedef {string} MessageComponentType
 */
 exports.MessageComponentTypes = createEnum([null, 'ACTION_ROW', 'BUTTON', 'SELECT_MENU']);

function createEnum(keys) {
    const obj = {};
    for (const [index, key] of keys.entries()) {
        if (key === null) continue;
        obj[key] = index;
        obj[index] = key;
    }
    return obj;
}
