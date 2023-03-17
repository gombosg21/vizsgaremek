'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carousel_reactionlist extends Model {
    static associate(models) {
      this.hasMany(models.user, { sourceKey: "user_ID", foreignKey: "ID" });
      this.hasMany(models.carousel, { sourceKey: "carousel_ID", foreignKey: "ID" });
      this.hasMany(models.reaction, { sourceKey: "reaction_ID", foreignKey: "ID" });
    }
  }
  carousel_reactionlist.init({
    user_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    carousel_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'carousel', key: 'ID' } },
    reaction_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'reaction', key: 'ID' } },
    date: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
    {
      sequelize,
      modelName: 'carousel_reactionlist',
      timestamps: true,
      createdAt: 'date',
      updatedAt: false,
      paranoid: false,
    });
  return carousel_reactionlist;
};