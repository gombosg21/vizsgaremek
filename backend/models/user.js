'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.media)
      this.hasMany(models.thread)
      this.hasMany(models.comment)
    }
  };
  user.init({
    ID: {type: DataTypes.INTEGER, allowNull:false, autoIncrement:true,primaryKey:true},
    name: {type:DataTypes.STRING, allowNull:false, unique:true},
    deleted: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue: false},
    banned:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue: false},
    type:{type:DataTypes.INTEGER,allowNull:false,defaultValue:0},
    register_date:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
    password:{type:DataTypes.STRING,allowNull:false},
    email_verified:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue: false},
    email:{type:DataTypes.STRING,allowNull:false},
    last_online:{type:DataTypes.DATE,allowNull:false},
    birth_date:{type:DataTypes.DATEONLY,allowNull:false}, 
    profile_description:{type:DataTypes.TEXT},
    profile_visibility:{type:DataTypes.INTEGER,allowNull:false,defaultValue:0} 
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'register_date',
    updatedAt: false,
    paranoid: true,
    modelName: 'user',
  });
  return user;
};