'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_ID" });
      this.belongsTo(models.media, { foreignKey: "media_ID" });
      this.hasMany(models.comment, { foreignKey: "thread_ID" });
      this.belongsToMany(models.reaction, { through: models.thread_reactionlist, foreignKey: "reaction_ID", sourceKey: "ID" });
    }
  };
  thread.init({
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    media_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'media', key: 'ID' } },
    user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'ID' } },
    profile_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: 'ID' } },
    carousel_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'carousel', key: 'ID' } },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    last_activity: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  }, {
    sequelize,
    modelName: 'thread',
    paranoid: true,
    timestamps: true,
    createdAt: 'created',
    updatedAt: false,
  });
  return thread;
};