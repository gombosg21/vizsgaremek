'use strict';

const media = require('../models/media');
const user = require('../models/user');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('threads', {
      ID: {
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      media_ID: {
        allowNull:false,
        references: 
        {
          model:'media',
          key: 'ID'
        },
        type: Sequelize.INTEGER
      },
      user_ID: {
        allowNull:false,
        references: 
        {
          model:'users',
          key: 'ID'
        },
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        allowNull:false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      deleted: {
        allowNull:false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      created: {
        allowNull:false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      last_activity: {
        allowNull:false,
        defaultValue:Sequelize.NOW,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('threads');
  }
};