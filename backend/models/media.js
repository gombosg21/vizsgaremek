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
      // define association here
    }
  }
  media.init({
    ID: DataTypes.INTEGER,
    user_ID: DataTypes.INTEGER,
    data: DataTypes.BLOB,
    deleted: DataTypes.BOOLEAN,
    uploaded: DataTypes.DATE,
    last_edit: DataTypes.DATE,
    descption: DataTypes.TEXT,
    visibility: DataTypes.INTEGER,
    placeholder_text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'media',
  });
  return media;
};