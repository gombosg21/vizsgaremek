'use strict';

const media = require('../models/media');

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
        type: Sequelize.STRING + 'CHARSET utf8 COLLATE utf8_hungarian_ci'
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
        defaultValue: Sequelize.literal('CURRRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING + 'CHARSET utf8 COLLATION utf8_binary_ci'
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
        type: Sequelize.INTEGER,
        references:{model:media,key:'ID'}
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};