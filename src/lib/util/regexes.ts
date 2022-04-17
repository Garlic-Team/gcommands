/**
 * Regexes for arguments
 */
export const userRegexp = /^(?:<@!?)?([0-9]+)>?$/;
export const roleRegexp = /^(?:<@&)?([0-9]+)>?$/;
export const channelRegexp = /^(?:<#)?([0-9]+)>?$/;
export const mentionableRegexp = /^(?:<@!?)?(?:<@&?)?([0-9]+)>?$/;

export const commandAndOptionNameRegexp = /^[\P{Lu}\p{N}_-]+$/u;
