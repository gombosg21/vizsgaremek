'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reaction extends Model {
    static associate(models) {
      this.belongsToMany(models.media, { through: models.media_reactionlist, foreignKey: 'reaction_ID', sourceKey: 'ID' });
      this.belongsToMany(models.carousel, { through: models.carousel_reactionlist, foreignKey: 'reaction_ID', sourceKey: 'ID' });
      this.belongsToMany(models.user, { through: models.user_reactionlist, foreignKey: 'reaction_ID', sourceKey: 'ID', as: "profile_reaction" });
      this.belongsToMany(models.thread, { through: models.thread_reactionlist, foreignKey: 'reaction_ID', sourceKey: 'ID' });
      this.belongsToMany(models.comment, { through: models.comment_reactionlist, foreignKey: 'reaction_ID', sourceKey: 'ID' });
    }
  }
  reaction.init({
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    data: { type: DataTypes.TEXT('long'), allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  }, {
    sequelize,
    modelName: 'reaction',
    paranoid: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  });
  return reaction;
};