'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID: {
        type: Sequelize.INTEGER
      },
      user_ID: {
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.BLOB
      },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      uploaded: {
        type: Sequelize.DATE
      },
      last_edit: {
        type: Sequelize.DATE
      },
      descption: {
        type: Sequelize.TEXT
      },
      visibility: {
        type: Sequelize.INTEGER
      },
      placeholder_text: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('media');
  }
};