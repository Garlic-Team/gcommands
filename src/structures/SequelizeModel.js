const { Model } = require('sequelize');

/**
 * The builder for the sequelize model
 */
class SequelizeModel {
    /**
     * @param {GCommandsClient} client
     * @param {object} data
     * @param {object} options
     * @constructor
    */
    constructor(client, data, options) {
        this.client = client;
        this.sequelize = client.database;

        return this.setup(data, options);
    }

    /**
     * Setup function
     * @param {object} data
     * @param {object} options
     * @returns {Model}
     */
    setup(data, options) {
        class Base extends Model { }
        return Base.init(data, { sequelize: this.sequelize, ...options });
    }
}

module.exports = SequelizeModel;
