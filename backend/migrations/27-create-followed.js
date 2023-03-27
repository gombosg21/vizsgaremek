'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('followed', {
            user_ID:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            followed_ID:{
                type:Sequelize.INTEGER,
                allowNull:true
            },
            date:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('followed');
    }
};