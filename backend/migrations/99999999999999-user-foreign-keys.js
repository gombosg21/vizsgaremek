'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('users', { fields: ['profile_pic'], type: 'foreign key', name: 'fk_prof_pic', references: { table: 'media', field: 'ID' } })
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('users', 'fk_prof_pic')
    }
};
