const GError = require('../structures/GError');

/**
 * The loader for the sequelize database and sequelize models
 * @private
 */
class GDatabaseLoader {
    /**
     * @param {GCommandsClient} client
     * @constructor
    */
    constructor(client) {
        /**
         * The client
         * @type {GCommandsClient}
        */
        this.client = client;

        this.__loadDB();
    }

    /**
     * Internal method to load database
     * @returns {void}
     */
     __loadDB() {
        const dbType = this.client.database;
        if (!dbType) { this.client.database = undefined; } else {
            try {
                const Keyv = require('@keyvhq/core');

                this.client.database = new Keyv(dbType);
            } catch (e) {
                throw new GError('[DATABASE]', e);
            }
        }
    }
}

module.exports = GDatabaseLoader;
