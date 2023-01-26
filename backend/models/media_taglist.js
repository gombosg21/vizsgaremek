'use strict';
const {
  Model
} = require('sequelize');
const media = require('./media');
const tag = require('./tag');
module.exports = (sequelize, DataTypes) => {
  class media_taglist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  media_taglist.init({
    tag_name: 
    {
      allowNull:false,
      type:DataTypes.STRING,
      references:{model:tag,key:'name'}
    },
    media_ID: 
    {
      allowNull:false,
      type:DataTypes.INTEGER,
      references:{model:media,key:'ID'}
    }
  }, 
  {
    sequelize,
    modelName: 'media_taglist',
  });
  return media_taglist;
};