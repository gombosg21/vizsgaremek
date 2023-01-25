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
      // define association here
    }
  }
  user.init({
    ID: DataTypes.INTEGER,
    name: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    banned: DataTypes.BOOLEAN,
    type: DataTypes.INTEGER,
    register_date: DataTypes.DATE,
    password: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    last_online: DataTypes.DATE,
    birth_date: DataTypes.DATEONLY,
    profile_description: DataTypes.TEXT,
    profile_visibility: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};