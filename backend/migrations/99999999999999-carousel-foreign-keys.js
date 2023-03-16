'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('carousels', { fields: ['user_ID'], type: 'foreign key', name: 'fk_carousel_user_id', references: { table: 'users', field: 'ID' } })
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('carousels', 'fk_carousel_user_id')
    }
};
