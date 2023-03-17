'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment_reactionlist extends Model {
    static associate(models) {
      this.hasMany(models.user, { sourceKey: "user_ID", foreignKey: "ID" });
      this.hasMany(models.comment, { sourceKey: "comment_ID", foreignKey: "ID" });
      this.hasMany(models.reaction, { sourceKey: "reaction_ID", foreignKey: "ID" });
    }
  }
  comment_reactionlist.init({
    user_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    comment_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'comment', key: 'ID' } },
    reaction_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'reaction', key: 'ID' } },
    date: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
    {
      sequelize,
      modelName: 'comment_reactionlist',
      timestamps: true,
      createdAt: 'date',
      updatedAt: false,
      paranoid: false,
    });
  return comment_reactionlist;
};