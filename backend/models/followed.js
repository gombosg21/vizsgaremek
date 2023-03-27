'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class followed extends Model {
        static associate(models) {
            this.hasOne(models.user, { foreignKey: "ID", sourceKey: "user_ID" });
            this.hasMany(models.user, { foreignKey: "ID", sourceKey: "followed_ID" })
        };
    };
    followed.init({
        user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: "ID" } },
        followed_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: "ID" } },
        date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'followed',
    });
    return followed;
};