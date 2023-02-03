'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      thread.belongsTo(models.user)
      thread.belongsTo(models.media)
      thread.hasMany(models.comment)
    }
  }
  thread.init({
    ID:{type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true,allowNull:false},
    media_ID:{type:DataTypes.INTEGER,allowNull:false,references:{model:media,key:'ID'}},
    user_ID:{type:DataTypes.INTEGER,allowNull:false,references:{model:user,key:'ID'}},
    name:{type:DataTypes.STRING,allowNull:false},
    status:{type:DataTypes.INTEGER,allowNull:false,defaultValue:0},
    deleted:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    // created:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP},
    last_activity:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.CURRENT_TIMESTAMP} 
  }, {
    sequelize,
    modelName: 'thread',
    paranoid: true,
    timestamps:true,
    updatedAt: false,
  });
  return thread;
};