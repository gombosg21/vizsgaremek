'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_reactionlist extends Model {
    static associate(models) {
      this.hasMany(models.user, { sourceKey: "user_ID", foreignKey: "ID", as: "profile_reaction_owner" });
      this.hasMany(models.profile, { sourceKey: "profile_ID", foreignKey: "user_ID", as: "profile_reaction_subject" });
      this.hasMany(models.reaction, { sourceKey: "reaction_ID", foreignKey: "ID", as: "profile_reaction" });
    }
  }
  user_reactionlist.init({
    user_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    profile_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'user', key: 'ID' } },
    reaction_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'reaction', key: 'ID' } },
    date: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'user_reactionlist',
    timestamps: true,
    createdAt: 'date',
    updatedAt: false,
    paranoid: false,
  });
  return user_reactionlist;
};