const { Model } = require('sequelize');

class SequelizeModel {
    constructor(client, data, options) {
        this.client = client;
        this.sequelize = client.database;

        return this.setup(data, options);
    }
    setup(data, options) {
        class Base extends Model { }
        return Base.init(data, { sequelize: this.sequelize, ...options });
    }
}

module.exports = SequelizeModel;
