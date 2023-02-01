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
      // define association here
    }
  }
  thread.init({
    thread_ID: DataTypes.INTEGER,
    media_ID: DataTypes.INTEGER,
    user_ID: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    last_activity: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'thread',
  });
  return thread;
};