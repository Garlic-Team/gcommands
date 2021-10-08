const GError = require('../structures/GError');

/**
 * The GDatabaseLoader class
 */
class GDatabaseLoader {
    /**
     * The GDatabaseLoader class
     * @param {GCommandsClient} client
    */
    constructor(client) {
        /**
         * Client
         * @type {GCommandsClient}
        */
        this.client = client;

        this.__loadDB();
    }

    /**
     * Internal method to dbLoad
     * @returns {boolean}
     * @private
     */
    __loadDB() {
        const dbType = this.client.database;
        if (!dbType) { this.client.database = undefined; } else {
            try {
                const Keyv = require('keyv');

                this.client.database = new Keyv(dbType);
            } catch (e) {
                throw new GError('[DATABASE]', e);
            }
        }
    }
}

module.exports = GDatabaseLoader;
