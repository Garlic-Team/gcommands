const GError = require('../structures/GError');

/**
 * The GDatabaseLoader class
 */
class GDatabaseLoader {
    /**
     * The GDatabaseLoader class
     * @param {GCommands} GCommandsClient
    */
    constructor(GCommandsClient) {
        /**
         * GCommandsClient
         * @type {GCommands}
        */
        this.GCommandsClient = GCommandsClient;

        /**
         * Client
         * @type {Client}
        */
        this.client = this.GCommandsClient.client;

        this.__loadDB();
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    __loadDB() {
        let dbType = this.GCommandsClient.database;
        if (!dbType) { this.client.database = undefined; } else {
            try {
                const Keyv = require('keyv');
                this.client.database = new Keyv(dbType);
            } catch(e) {
                throw new GError("[DATABASE]", e)
            }
        }
    }
}

module.exports = GDatabaseLoader;
