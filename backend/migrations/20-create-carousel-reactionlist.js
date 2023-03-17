'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carousel_reactionlists', {
      user_ID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      carousel_ID: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      reaction_ID: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull:false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carousel_reactionlists');
  }
};