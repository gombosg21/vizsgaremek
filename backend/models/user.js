const encryptPassword = require('../util/auth').generatePassword;
const matchPassword = require('../util/auth').validatePassword;

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.hasMany(models.media, { foreignKey: "user_ID" });
      this.hasMany(models.thread, { foreignKey: "user_ID" });
      this.hasMany(models.comment, { foreignKey: "user_ID" });
      this.hasMany(models.carousel, { foreignKey: "user_ID" });
      this.hasOne(models.profile, { foreignKey: "user_ID" });
      this.belongsToMany(models.reaction, { through: models.profile_reactionlist, foreignKey: "user_ID", sourceKey: "ID", as: "profile_reaction_owner" });
      this.hasMany(models.profile_reactionlist, { foreignKey: "user_ID", sourceKey: "ID" });
      this.belongsToMany(models.reaction, { through: models.thread_reactionlist, foreignKey: "user_ID", sourceKey: "ID", as: "thread_reaction_owner" });
      this.hasMany(models.thread_reactionlist, { foreignKey: "user_ID", sourceKey: "ID" });
      this.belongsToMany(models.reaction, { through: models.media_reactionlist, foreignKey: "user_ID", sourceKey: "ID", as: "media_reaction_owner" });
      this.hasMany(models.media_reactionlist, { foreignKey: "user_ID", sourceKey: "ID" });
      this.belongsToMany(models.reaction, { through: models.comment_reactionlist, foreignKey: "user_ID", sourceKey: "ID", as: "comment_reaction_owner" });
      this.hasMany(models.comment_reactionlist, { foreignKey: "user_ID", sourceKey: "ID" });
      this.belongsToMany(models.reaction, { through: models.carousel_reactionlist, foreignKey: "user_ID", sourceKey: "ID", as: "carousel_reaction_owner" });
      this.hasMany(models.carousel_reactionlist, { foreignKey: "user_ID", sourceKey: "ID" });
      this.hasOne(models.friends, { sourceKey: "ID", foreignKey: "user_ID", as: "friendship_starter" });
      this.hasMany(models.friends, { sourceKey: "ID", foreignKey: "friend_ID", as: "friendship_subject" })
    };

    validatePassword(password) {
      return matchPassword(password, this.password);
    };

  };
  user.init({
    ID: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    banned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    register_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    password: { type: DataTypes.TEXT, allowNull: false },
    password_reset_token: { type: DataTypes.TEXT, unique: true, allowNull: true, defaultValue: null },
    password_reset_token_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    email_token_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    email_token: { type: DataTypes.TEXT, unique: true, allowNull: true, defaultValue: null },
    email: { type: DataTypes.STRING, allowNull: false },
    last_online: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    birth_date: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  }, {
    hooks: {
      beforeCreate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        }
      ],
      beforeBulkCreate: [
        async (User) => {
          User.password_hash = await encryptPassword(User.password);
        }
      ],
      beforeUpdate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        }
      ],
      beforeBulkUpdate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        }
      ]
    },
    sequelize,
    timestamps: true,
    createdAt: 'register_date',
    updatedAt: false,
    paranoid: true,
    modelName: 'user',
  });
  return user;
};