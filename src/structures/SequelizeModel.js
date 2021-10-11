class SequelizeModel {
    constructor(client, options, modelName) {
        this.client = client;
        this.sequelize = client.database;

        return this.setup(options, modelName);
    }
    setup(options, modelName) {
        const { Model } = require('sequelize');
        class Base extends Model {}

        Base.init(options.attributes, { sequelize: this.sequelize, modelName });

        return Base;
    }
}

module.exports = SequelizeModel;
