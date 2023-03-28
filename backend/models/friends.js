'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class friends extends Model {
        static associate(models) {
            this.hasOne(models.user, { foreignKey: "ID", sourceKey: "user_ID" });
            this.hasMany(models.user, { foreignKey: "ID", sourceKey: "friend_ID" });
            this.hasMany(models.activity, { sourceKey: "friend_ID", foreignKey: "friend_ID" });
        };
    };
    friends.init({
        user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: "ID" } },
        friend_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: "ID" } },
        pending: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'friends',
    });
    return friends;
};