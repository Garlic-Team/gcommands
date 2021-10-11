const SequelizeModel = require('../SequelizeModel');
const { DataTypes } = require('sequelize');

module.exports = class extends SequelizeModel {
    constructor(client) {
        super(client, {
            prefix: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, 'Prefix');
    }
};
