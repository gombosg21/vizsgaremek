'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('media', { fields: ['user_ID'], type: 'foreign key', name: 'fk_media_user', references: { table: 'users', field: 'ID' } })
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('media', 'fk_media_user')
    }
};
