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
    ID: {type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true,allowNull:false},
    user_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:user,key:'ID'}},
    data: {type:DataTypes.BLOB,allowNull:false},
    deleted: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    uploaded: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP},
    last_edit: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP,onUpdate:DataTypes.CURRENT_TIMESTAMP},
    descption: {type:DataTypes.TEXT},
    visibility: {type:DataTypes.INTEGER,allowNull:false,defaultValue:0},
    placeholder_text: {type:DataTypes.TEXT,allowNull:false}
  }, {
    sequelize,
    modelName: 'media',
  });
  return media;
};