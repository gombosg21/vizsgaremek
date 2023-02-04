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
      this.belongsTo(models.user)
      this.hasMany(models.thread)
      this.belongsToMany(models.tag,{through:models.media_taglist})
    }
  };
  media.init({
    ID: {type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true,allowNull:false},
    user_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:'user',key:'ID'}},
    data: {type:DataTypes.BLOB,allowNull:false},
    deleted: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    uploaded: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
    last_edit: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW,onUpdate:DataTypes.NOW},
    descption: {type:DataTypes.TEXT},
    visibility: {type:DataTypes.INTEGER,allowNull:false,defaultValue:0},
    placeholder_text: {type:DataTypes.TEXT,allowNull:false}
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