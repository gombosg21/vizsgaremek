'use strict';

const { DataTypes } = require('sequelize');
const user = require('../models/user')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_ID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      file_data: {
        allowNull:false,
        type: Sequelize.TEXT('long')
      },
      deleted: {
        allowNull:false,
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      uploaded: {
        allowNull:false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      last_edit: {
        allowNull:false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      visibility: {
        allowNull:false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      placeholder_text: {
        allowNull:false,
        type: Sequelize.TEXT
      },
      deletedAt:
      {
        allowNull:true,
        defaultValue:null,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media');
  }
};