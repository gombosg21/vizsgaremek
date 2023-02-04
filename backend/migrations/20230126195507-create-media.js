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
        references: {model:'users',key:'ID'},
        type: Sequelize.INTEGER
      },
      data: {
        allowNull:false,
        type: Sequelize.BLOB
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
        // onUpdate: Sequelize.NOW,
        type: Sequelize.DATE
      },
      descption: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media');
  }
};