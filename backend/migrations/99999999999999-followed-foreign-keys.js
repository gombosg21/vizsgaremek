'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('followed', { fields: ['user_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_followed_user_ID' });
        queryInterface.addConstraint('followed', { fields: ['followed_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_followed_followed_ID' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('followed', 'fk_followed_user_ID');
        queryInterface.removeConstraint('followed', 'fk_followed_followed_ID');
    }
};
