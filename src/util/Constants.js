/**
 * Debug Event
 * @event GCommands#debug
 * @example client.on('debug', (info) => { console.log(info); });
*/

/**
 * Log Event
 * @event GCommands#log
 * @example client.on('log', (info) => { console.log(info); });
*/

/**
 * Events
 * * debug
 * * log
 * * commandExecute
 * * commandError
 * @type {Object}
 */
exports.Events = {
    DEBUG: 'debug',
    LOG: 'log',
    COMMAND_EXECUTE: 'commandExecute',
    COMMAND_ERROR: 'commandError',
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
 * ButtonType
 * * blurple
 * * gray
 * * grey
 * * green
 * * red
 * * url
 * * primary
 * * secondary
 * * danger
 * * link
 * @type {Object}
 */
 exports.ButtonType = {
    blurple: 'blurple',
    gray: 'gray',
    grey: 'gray',
    green: 'green',
    red: 'red',
    url: 'url',
    primary: 'green',
    secondary: 'gray',
    danger: 'red',
    link: 'url',
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

/**
 * The GCommandsOptions
 * @property {string} cmdDir
 * @property {string} eventDir
 * @property {GCommandsOptionsLanguage} language
 * @property {GCommandsOptionsCommands} commands
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
 * * true
 * * false
 * @typedef {(string | boolean)} GCommandsOptionsCommandsSlash
 */

/**
 * The GCommandsOptionsCommands
 * @property {GCommandsOptionsCommandsSlash} slash
 * @property {GCommandsOptionsCommandsContext} context
 * @property {string} prefix
 * @typedef {(object)} GCommandsOptionsCommands
 * @typedef {(Object)} GCommandsOptionsCommands
 */

/**
 * The GPayloadOptions
 * @property {string} content
 * @property {MessageEmbed[]} embeds
 * @property {MessageActionRow[]} components
 * @property {MessageAttachment[]} attachments
 * @property {Boolean} ephemeral
 * @property {Object} allowedMentions
 * @property {(string | Boolean)} inlineReply
 * @property {(string | Array)} stickers
 * @example .send({
 *  content: 'hello',
 *  embeds: [embed],
 *  components: [actionRow],
 *  attachments: [myMessageAttachment],
 *  ephemeral: false,
 *  allowedMentions: { parse: ['users','roles','everyone'] },
 *  inlineReply: true,
 *  stickers: ['sticker id']
 * })
 * @typedef {(string | Object)} GPayloadOptions
*/

/**
 * The CommandRunOptions
 * @property {Client} client
 * @property {GInteraction} interaction
 * @property {GuildMember} member
 * @property {Message | undefined} message
 * @property {Guild} guild
 * @property {TextChannel | NewsChannel} channel
 * @property {GPayloadOptions} respond
 * @property {GPayloadOptions} edit
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
 * @property {GPayloadOptions} respond
 * @property {GPayloadOptions} edit
 * @typedef {(Object)} Inhibitor
 */

/**
 * The InteractionEventClicker
 *
 * @property {GuildMember} member
 * @property {User} user
 * @property {Snowflake} id
 * @typedef {(Object)} InteractionEventClicker
 */

/**
 * The GInteractionInteraction
 *
 * @property {string} name
 * @property {Array} options
 * @property {number} id
 * @typedef {(Object)} GInteractionInteraction
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
 * @property {Snowflake} guildOnly
 * @property {boolean} channelTextOnly
 * @property {boolean} channelNewsOnly
 * @property {boolean} channelThreadOnly
 * @property {boolean} nsfw
 * @property {boolean} slash
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
 * @typedef {(Object)} CommandArgsOption
 */

/**
 * The CommandArgsChoices
 *
 * @property {string} name
 * @property {string} value
 * @typedef {(Object)} CommandArgsChoice
 */
