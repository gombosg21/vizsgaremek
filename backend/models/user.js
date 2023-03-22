const encryptPassword = require('../util/auth').generatePassword;

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
      this.belongsToMany(models.reaction, { through: models.user_reactionlist, foreignKey: "reaction_ID", sourceKey: "ID" });
    };

    getView() {
      if (this.deletedAt == null) {
        return [
          this.name,
          this.banned,
          this.type,
          this.register_date,
          this.last_online,
          this.birth_date,
          this.profile_description,
          this.profile_pic,
          this.profile_visibility,
          this.gender
        ];
      } else {
        return [];
      };
    };

    getProfile() {
      return [
        this.profile_description,
        this.profile_pic,
        this.profile_visibility
      ]
    };

    validatePassword(pwd) {
      return password.validatePassword(pwd, this.password_hash, this.password_salt);
    };

  };
  user.init({
    ID: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    alias: { type: DataTypes.STRING, allowNull: true },
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
    profile_description: { type: DataTypes.TEXT },
    profile_visibility: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    profile_pic: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'media', key: 'ID', }, onDelete: 'set null', onUpdate: 'cascade' },
    gender: { type: DataTypes.INTEGER, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  }, {
    hooks: {
      beforeCreate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        },
        (User) => {
          if (User.alias == null) { User.alias = User.name }
        },
      ],
      beforeBulkCreate: [
        async (User) => {
          User.password_hash = await encryptPassword(User.password);
        },
        (User) => {
          if (User.alias == null) { User.alias = User.name }
        },
      ],
      beforeUpdate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        },
        (User) => {
          if (User.alias == null) { User.alias = User.name }
        },
      ],
      beforeBulkUpdate: [
        async (User) => {
          User.password = await encryptPassword(User.password);
        },
        (User) => {
          if (User.alias == null) { User.alias = User.name }
        },
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