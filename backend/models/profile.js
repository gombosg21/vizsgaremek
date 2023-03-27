'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class profile extends Model {
        static associate(models) {
            this.hasOne(models.user, { sourceKey: "user_ID", foreignKey: "ID" });
            this.hasOne(models.media, { sourceKey: "picture_ID", foreignKey: "ID" });
            this.belongsToMany(models.reaction, { through: models.user_reactionlist, foreignKey: "profile_ID", sourceKey: "user_ID"});
        };
    };
    profile.init({
        user_ID: { type: DataTypes.INTEGER, allowNull: false, primaryKey:true ,unique: true, references: { model: 'user', key: 'ID' } },
        description: { type: DataTypes.TEXT, allowNull: true },
        visibility: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        picture_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'media', key: 'ID' } }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'profile',
    });
    return profile;
};