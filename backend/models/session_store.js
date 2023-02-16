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
      this.belongsTo(models.user,{foreignKey:"user_ID",targetKey:"ID"})
    }
  }
  session_store.init({
    ID: {type:DataTypes.INTEGER,allowNull:false,primaryKey:true,autoIncrement:true},
    user_ID: {type:DataTypes.INTEGER,allowNull:false,references:{model:"user",key:"ID"}},
    sid: {type:DataTypes.STRING,allowNull:false},
    data:{type:DataTypes.TEXT,allowNull:true,defaultValue:null},
    logged_in:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    created: {type:DataTypes.DATE,allowNull:false},
    expires: {type:DataTypes.DATE,allowNull:false}
  }, {
    sequelize,
    timestamps:true,
    createdAt:"created",
    deletedAt:false,
    modelName: 'session_store',
  });
  return session_store;
};