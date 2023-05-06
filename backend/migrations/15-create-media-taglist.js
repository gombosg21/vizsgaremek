'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media_taglists', {
      tag_ID: {
        allowNull: false,
        unique:"tagkey",
        type: Sequelize.INTEGER
      },
      media_ID: {
        allowNull:false,
        unique:"tagkey",
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media_taglists');
  }
};