'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      deleted: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      banned: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      type: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      register_date: {
        allowNull: false,
        defaultValue: DataTypes.NOW,
        type: Sequelize.DATE,
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password_salt:{
        allowNull: false,
        type: Sequelize.STRING
      },
      email_verified: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_online: {
        allowNull: false,
        type: Sequelize.DATE
      },
      birth_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      profile_description: {
        type: Sequelize.TEXT
      },
      profile_visibility: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      profile_pic: {
      type: Sequelize.INTEGER
      },
      gender: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      deletedAt:{
        allowNull:true,
        defaultValue:null,
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};