'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('friends', { fields: ['user_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_friends_user_ID' });
        queryInterface.addConstraint('friends', { fields: ['friend_ID'], type: 'foreign key', references: { table: 'users', field: 'ID' }, name: 'fk_friends_frined_ID' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('friends', 'fk_friends_user_ID');
        queryInterface.removeConstraint('friends', 'fk_friends_frined_ID');
    }
};
