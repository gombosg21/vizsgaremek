'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carousel_medialist extends Model {
    static associate(models) {
      this.hasMany(models.carousel, { sourceKey: "carousel_ID", foreignKey: "ID" });
      this.hasMany(models.media, { sourceKey: "media_ID", foreignKey: "ID" });
    }
  }
  carousel_medialist.init({
    carousel_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'carousel', key: 'ID' } },
    media_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'media', key: 'ID' } }},
    {
      sequelize,
      modelName: 'carousel_medialist',
      timestamps: false
    });
  return carousel_medialist;
};