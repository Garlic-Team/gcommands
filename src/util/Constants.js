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
 * Enum for Events
 * @readonly
 * @enum {string}
 */
exports.Events = {
    DEBUG: 'debug',
    LOG: 'log'
}

/**
 * Enum for ArgumentType
 * @readonly
 * @enum {number}
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
 * Enum for ButtonType
 * @readonly
 * @enum {number}
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