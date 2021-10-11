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
        }, 'Guild');
    }
}

module.exports = GuildModel;
