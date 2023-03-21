'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carousel extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'user_ID' });
      this.belongsToMany(models.media, { through: models.carousel_medialist, foreignKey: "carousel_ID", sourceKey: "ID" });
      this.belongsToMany(models.reaction, { through: models.media_reactionlist, foreignKey: "carousel_ID", sourceKey: "ID" })
    }
  }
  carousel.init({
    ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'ID' } },
    name: { type: DataTypes.STRING, allowNull: false },
    visibility: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    description: { type: DataTypes.STRING, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    modified_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'carousel',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'modified_date',
  });
  return carousel;
};