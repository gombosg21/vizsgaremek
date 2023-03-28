'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class activity extends Model {
        static associate(models) {
            this.hasOne(models.user, { foreignKey: "ID", sourceKey: "user_ID" });
            this.hasMany(models.followed, { foreignKey: "followed_ID", sourceKey: "followed_ID" });
            this.hasMany(models.friends, { foreignKey: "friend_ID", sourceKey: "friend_ID" });
        };
    };
    activity.init({
        user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: "ID" } },
        friend_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: "ID" } },
        followed_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: "ID" } }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'activity',
    });
    return activity;
};