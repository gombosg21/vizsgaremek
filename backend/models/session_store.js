'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session_store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  session_store.init({
    ID: {type:DataTypes.INTEGER,allowNull:false,primaryKey:true,autoIncrement:true},
    sid: {type:DataTypes.STRING,allowNull:false},
    data:{type:DataTypes.TEXT,allowNull:true,defaultValue:null},
    expires:{type:DataTypes.DATE,defaultValue:null,allowNull:true}
  }, {
    sequelize,
    timestamps:false,
    modelName: 'session_store',
  });
  return session_store;
};