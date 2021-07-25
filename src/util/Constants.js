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

exports.Events = {
    DEBUG: 'debug',
    LOG: 'log'
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
 * <info>You can see <a href="https://gcommands.js.org/guide/guide/miscellaneous/inhibitor.html">guide</a> to get a better idea of how inhibitors work.</info>
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