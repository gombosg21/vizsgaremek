'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('friends', {
            user_ID:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            friend_ID:{
                type:Sequelize.INTEGER,
                allowNull:true
            },
            pending:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:true,
            },
            date:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('friends');
    }
};