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
      logged_in: 
      {
        allowNull:false,
        defaultValue:false,
        type:Sequelize.BOOLEAN
      },
      created: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      },
      expires: {
        allowNull:false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_stores');
  }
};