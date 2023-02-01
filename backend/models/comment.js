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
      // define association here
    }
  }
  comment.init({
    thread_ID: DataTypes.INTEGER,
    thread_ID: DataTypes.INTEGER,
    user_ID: DataTypes.INTEGER,
    content: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    last_edit: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};