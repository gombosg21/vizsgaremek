const { Op } = require("sequelize");

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_ID" })
      this.hasMany(models.thread, { foreignKey: "media_ID" })
      this.belongsToMany(models.tag, { through: models.media_taglist, foreignKey: "media_ID", sourceKey: "ID" })
      this.belongsToMany(models.carousel, { through: models.carousel_medialist, foreignKey: "media_ID", sourceKey: "ID" })
    }

    removeTags(tagArray) {
      this.tags.delete({ where: { ID: { [Op.in]: tagArray } } });
    };

  };
  media.init({
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    user_ID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'ID' } },
    file_data: { type: DataTypes.TEXT('long'), allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    uploaded: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    last_edit: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, onUpdate: DataTypes.NOW },
    description: { type: DataTypes.TEXT },
    visibility: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    placeholder_text: { type: DataTypes.TEXT, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  }, {
    sequelize,
    modelName: 'media',
    paranoid: true,
    timestamps: true,
    createdAt: 'uploaded',
    updatedAt: 'last_edit',
  });
  return media;
};