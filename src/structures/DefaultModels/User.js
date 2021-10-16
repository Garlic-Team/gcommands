const SequelizeModel = require('../SequelizeModel');
const { DataTypes } = require('sequelize');

class UserModel extends SequelizeModel {
    constructor(client) {
        super(client, {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
        }, 'User');
    }
}

module.exports = UserModel;
