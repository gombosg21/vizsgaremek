'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_stores', {
      ID: {
        type: Sequelize.INTEGER
      },
      user_ID: {
        type: Sequelize.INTEGER
      },
      session_ID: {
        type: Sequelize.INTEGER
      },
      created: {
        type: Sequelize.DATE
      },
      expires: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_stores');
  }
};