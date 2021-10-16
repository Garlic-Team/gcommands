const GError = require('../structures/GError');
const { isClass } = require('../util/util');
const path = require('path');
const fs = require('fs');
const { Events } = require('../util/Constants');
const Color = require('../structures/Color');

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
    async __loadDB() {
        const dbType = this.client.database;
        if (!dbType) { this.client.database = undefined; } else {
            try {
                const { Sequelize } = require('sequelize');

                this.client.database = new Sequelize(dbType);

                this.__loadDefaultModels();

                if (this.client.modelDir) await this.__loadModels(this.client.modelDir);

                this.client.database.sync({ force: true });
            } catch (e) {
                throw new GError('[DATABASE]', e);
            }
        }
    }

    /**
     * Internal method to load default models
     * @returns {void}
     */
    __loadDefaultModels() {
        const Guild = require('../structures/DefaultModels/Guild');
        const User = require('../structures/DefaultModels/User');

        new Guild(this.client);
        new User(this.client);
    }

    /**
     * Internal method to load models
     * @returns {void}
     */
    async __loadModels(dir) {
        for await (const fsDirent of fs.readdirSync(dir, { withFileTypes: true })) {
            let file = fsDirent.name;
            const fileType = path.extname(file);
            const fileName = path.basename(file, fileType);

            if (fsDirent.isDirectory()) {
                await this.__loadFiles(path.join(dir, file));
                continue;
            } else if (!['.js', '.ts'].includes(fileType)) { continue; }

            file = require(path.join(dir, file));
            if (isClass(file)) {
                file = new file(this.client);
            }

            this.client.emit(Events.LOG, new Color(`&d[GCommands] &aLoaded (Model): &e➜   &3${fileName}`, { json: false }).getText());
        }
    }
}

module.exports = GDatabaseLoader;
