'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('comments', { fields: ['user_ID'], type: 'foreign key', name: 'fk_comment_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('comments', { fields: ['thread_ID'], type: 'foreign key', name: 'fk_comment_thread', references: { table: 'threads', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('comments', 'fk_comment_user');
        queryInterface.removeConstraint('comments', 'fk_comment_thread');
    }
};