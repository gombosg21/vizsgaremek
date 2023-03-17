'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media_reactionlist extends Model {
    static associate(models) {
      this.hasMany(models.user, { sourceKey: "user_ID", foreignKey: "ID" });
      this.hasMany(models.media, { sourceKey: "media_ID", foreignKey: "ID" });
      this.hasMany(models.reaction, { sourceKey: "reaction_ID", foreignKey: "ID" });
    }
  }
  media_reactionlist.init({
    user_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    media_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'media', key: 'ID' } },
    reaction_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'reaction', key: 'ID' } },
    date: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
    {
      sequelize,
      modelName: 'media_reactionlist',
      timestamps: true,
      createdAt: 'date',
      updatedAt: false,
      paranoid: false,
    });
  return media_reactionlist;
};