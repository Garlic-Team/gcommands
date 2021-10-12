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
                const { Sequelize } = require('sequelize');

                this.client.database = new Sequelize(dbType);

                this.__loadDefaultModels();

                this.client.database.sync({ force: true });
            } catch (e) {
                throw new GError('[DATABASE]', e);
            }
        }
    }
    __loadDefaultModels() {
        const Guild = require('../structures/DefaultModels/Guild');
        // Const User = require('../structures/DefaultModels/User');

       new Guild(this.client);
        // New User(this.client);
    }
}

module.exports = GDatabaseLoader;
