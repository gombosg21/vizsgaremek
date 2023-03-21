'use strict';
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
      alias: {
        allowNull: true,
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
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      password_reset_token: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT
      },
      password_reset_token_date: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      },
      email_token: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT
      },
      email_token_date: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_online: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
        allowNull: true,
        type: Sequelize.INTEGER
      },
      profile_thread: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      gender: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      deletedAt: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};