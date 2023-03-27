'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('activity', { fields: ['user_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_activity_user_ID' });
        queryInterface.addConstraint('activity', { fields: ['friend_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_activity_friend_ID' });
        queryInterface.addConstraint('activity', { fields: ['followed_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_activity_followed_ID' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('activity', 'fk_activity_user_ID');
        queryInterface.removeConstraint('activity', 'fk_activity_friend_ID');
        queryInterface.removeConstraint('activity', 'fk_activity_followed_ID');
    }
};
