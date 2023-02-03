'use strict';
const {
  Model
} = require('sequelize');
const media = require('./media')
const media_taglist = require('./media_taglist')
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.media,{through:models.media_taglist})
    }
  };
  tag.init({
    name: {
    type:DataTypes.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  }
  }, {
    sequelize,
    modelName: 'tag',
  });
  return tag;
};