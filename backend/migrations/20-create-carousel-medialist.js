'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carousel_medialists', {
      carousel_ID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      media_ID: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carousel_medialists');
  }
};