const GError = require('../structures/GError');

/**
 * The main GCommands class
 * @deprecated
 */
class GCommands {
    /**
     * The GCommands class
     * @param {Client} client - Discord.js Client
     * @param {GCommandsOptions} options - Options (cmdDir, eventDir etc)
     */
    // eslint-disable-next-line no-unused-vars
    constructor(client, options = {}) {
        const message = 'The GCommands class is depracted and replaced with the GCommandsClient. See how to use the GCommandsClient: https://gcommands.js.org/guide/guide/gettingstarted/basicbot/#writing-code';
        throw new GError('[DEPRECATED]', message);
    }
}

module.exports = GCommands;
