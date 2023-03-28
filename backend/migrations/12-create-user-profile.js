'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('profiles', {
            user_ID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            description: {
                type: Sequelize.TEXT
            },
            visibility: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER
            },
            picture_ID: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            alias: {
                allowNull: true,
                type: Sequelize.STRING
            },
            last_updated: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
                defaultValue: null
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('profiles');
    }
};