'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media_taglist extends Model {
    static associate(models) {
      this.hasMany(models.tag, { sourceKey: "tag_ID", foreignKey: "ID" });
      this.hasMany(models.media, { sourceKey: "media_ID", foreignKey: "ID" });
    }
  }
  media_taglist.init({
    tag_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'tag', key: 'ID' } },
    media_ID: { allowNull: false, type: DataTypes.INTEGER, references: { model: 'media', key: 'ID' } }
  },
    {
      sequelize,
      modelName: 'media_taglist',
      timestamps: false
    });
  return media_taglist;
};