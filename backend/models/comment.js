'use strict';
const {
  Model
} = require('sequelize');
const thread = require('./thread');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comment.belongsTo(thread)
      comment.belongsTo(user)
    }
  }
  comment.init({
    ID: {type:DataTypes.INTEGER,allowNull:false,autoIncrement:true,primaryKey:true},
    thread_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:thread,key:'ID'}},
    user_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:user,key:'ID'}},
    content: {type:DataTypes.TEXT,allowNull:false},
    deleted: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    created: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP},
    last_edit: {type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP,onUpdate:CURRENT_TIMESTAMP}
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};