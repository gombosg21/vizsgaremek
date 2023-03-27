'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('activity', {
            user_ID:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            followed_ID:{
                type:Sequelize.INTEGER,
                allowNull:true
            },
            friend_ID:{
                type:Sequelize.INTEGER,
                allowNull:true
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('activity');
    }
};