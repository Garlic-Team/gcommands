/**
 * Regexes for arguments
 */

/**
 * Regex for user argument type that matches users by id
 * @raw `/^(?:<@!?)?([0-9]+)>?$/`
 */
export const userRegexp = /^(?:<@!?)?([0-9]+)>?$/;

/**
 * Regex for role argument type that matches roles by id
 * @raw `/^(?:<@&)?([0-9]+)>?$/
 */
export const roleRegexp = /^(?:<@&)?([0-9]+)>?$/;

/**
 * Regex for channel argument type that matches channels by id
 * @raw `/^(?:<#)?([0-9]+)>?$/`
 */
export const channelRegexp = /^(?:<#)?([0-9]+)>?$/;

/**
 * Regex for mentionable argument type
 * @see {@link userRegexp} for user argument type
 * @see {@link roleRegexp} for role argument type
 * @raw `/^(?:<@!?)?(?:<@&?)?([0-9]+)>?$/`
 */
export const mentionableRegexp = /^(?:<@!?)?(?:<@&?)?([0-9]+)>?$/;

/**
 * Regex for command and option names
 * @raw `/^[\P{Lu}\p{N}_-]+$/u`
 */
export const commandAndOptionNameRegexp = /^[\P{Lu}\p{N}_-a-A-zZ]+|[\s]$/u;
