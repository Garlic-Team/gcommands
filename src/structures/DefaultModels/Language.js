const SequelizeModel = require('../SequelizeModel');
const { DataTypes } = require('sequelize');

module.exports = class extends SequelizeModel {
    constructor(client) {
        super(client, {
            language: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, 'Language');
    }
};
