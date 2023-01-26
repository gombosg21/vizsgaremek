'use strict';

const media = require('../models/media');
const tag = require('../models/tag')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media_taglists', {
      tag_name: {
        allowNull: false,
        type: Sequelize.STRING,
        references:{model:tag,key:'name'}
      },
      media_ID: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {model:media,key:'ID'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media_taglists');
  }
};