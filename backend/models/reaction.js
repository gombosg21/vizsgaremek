'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reaction.init({
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    data: { type: DataTypes.TEXT('long'), allowNull: false }
  }, {
    sequelize,
    modelName: 'reaction',
    paranoid: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  });
  return reaction;
};