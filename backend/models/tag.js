'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.media,{through:models.media_taglist,foreignKey:"tag_ID",sourceKey:"ID"})
    }
  };
  tag.init({
    ID: {type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true,allowNull:false},
    name: {type:DataTypes.STRING,unique: true,allowNull: false },
    deletedAt:{type:DataTypes.DATE,allowNull:true,defaultValue:null}
  }, {
    sequelize,
    modelName: 'tag',
    timestamps: true,
    updatedAt:false,
    createdAt: false,
    deletedAt: true,
    paranoid: true
  });
  return tag;
};