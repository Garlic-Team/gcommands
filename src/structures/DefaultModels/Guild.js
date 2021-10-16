const SequelizeModel = require('../SequelizeModel');
const { DataTypes } = require('sequelize');

class GuildModel extends SequelizeModel {
    constructor(client) {
        super(client, {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            language: {
                type: DataTypes.STRING,
            },
            prefix: {
                type: DataTypes.STRING,
            },
        }, { modelName: 'Guild' });
    }
}

module.exports = GuildModel;
