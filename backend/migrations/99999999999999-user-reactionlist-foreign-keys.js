'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('user_reactionlists', { fields: ['profile_ID'], type: 'foreign key', name: 'fk_user_reactionlist_profile', references: { table: 'threads', field: 'ID' } });
        queryInterface.addConstraint('user_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_user_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('user_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_user_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('user_reactionlists', 'fk_user_reactionlist_profile');
        queryInterface.removeConstraint('user_reactionlists', 'fk_user_reactionlist_user');
        queryInterface.removeConstraint('user_reactionlists', 'fk_user_reactionlist_reaction');
    }
};
