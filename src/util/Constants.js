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
 * * DEBUG
 * * LOG
 * @type {Object}
 */
exports.Events = {
    DEBUG: 'debug',
    LOG: 'log'
}

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
 * @type {Object}
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
    NUMBER: 10
}

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
    link: 'url'
}

/**
 * The GCommandsOptions
 * @property {string} cmdDir
 * @property {string} eventDir
 * @property {GCommandsOptionsLanguage} language
 * @property {GCommandsOptionsSlash} Slash
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
 * @typedef {(string)} GCommandsOptionsLanguage
 */

/**
 * The GCommandsOptionsSlash
 * @property {boolean|string} slash
 * @property {string} prefix
 * @typedef {(object)} GCommandsOptionsSlash
 */

/**
 * The GPayloadOptions
 * @property {string} content
 * @property {MessageEmbed} embeds
 * @property {MessageActionRow} components
 * @property {MessageAttachment} attachments
 * @property {Boolean} ephemeral
 * @property {Object} allowedMentions
 * @property {(string | Boolean)} inlineReply
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
 * @property {boolean} nsfw
 * @property {boolean} slash
 * @typedef {(Object)} CommandOptions
 */