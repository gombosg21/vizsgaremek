'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thread_reactionlist extends Model {
    static associate(models) {
      this.hasMany(models.user, { sourceKey: "user_ID", foreignKey: "ID" });
      this.hasMany(models.thread, { sourceKey: "thread_ID", foreignKey: "ID" });
      this.hasMany(models.reaction, { sourceKey: "reaction_ID", foreignKey: "ID" });
    }
  }
  thread_reactionlist.init({
    user_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    thread_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'thread', key: 'ID' } },
    reaction_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'reaction', key: 'ID' } },
    date: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
    {
      sequelize,
      modelName: 'thread_reactionlist',
      timestamps: true,
      createdAt: 'date',
      updatedAt: false,
      paranoid: false,
    });
  return thread_reactionlist;
};