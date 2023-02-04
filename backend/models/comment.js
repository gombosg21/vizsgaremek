'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.thread)
      this.belongsTo(models.user)
    }
  };
  comment.init({
    ID: {type:DataTypes.INTEGER,allowNull:false,autoIncrement:true,primaryKey:true},
    thread_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:'thread',key:'ID'}},
    user_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:'user',key:'ID'}},
    content: {type:DataTypes.TEXT,allowNull:false},
    deleted: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    created: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
    last_edit: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW,onUpdate:DataTypes.NOW}
  }, {
    sequelize,
    modelName: 'comment',
    paranoid:true,
    timestamps:true,
    createdAt:'created',
    updatedAt:'last_edit',
  });
  return comment;
};