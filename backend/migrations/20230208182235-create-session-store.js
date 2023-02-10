'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_stores', {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement:true
      },
      user_ID: {
        type: Sequelize.INTEGER,
        allowNull:true
      },
      session_ID: {
        type: Sequelize.INTEGER,
        unique:true,
        allowNull:false
      },
      created: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
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