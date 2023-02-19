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
      sid: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false
      },
      data: 
      {
        allowNull:true,
        defaultValue:null,
        type:Sequelize.TEXT
      },
      expires:
      {
        allowNull:true,
        defaultValue:null,
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_stores');
  }
};