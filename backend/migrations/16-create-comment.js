'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      ID: {
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      thread_ID: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      user_ID: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      created: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
      last_edit: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
      deletedAt:
      {
        allowNull:true,
        defaultValue:null,
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};