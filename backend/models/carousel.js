'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carousel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'user_ID' })
      this.belongsToMany(models.media,{through:models.media_taglist,foreignKey:"carousel_ID",sourceKey:"ID"})
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