'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('profile_reactionlists', { fields: ['profile_ID'], type: 'foreign key', name: 'fk_user_reactionlist_profile', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('profile_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_user_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('profile_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_user_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('profile_reactionlists', 'fk_user_reactionlist_profile');
        queryInterface.removeConstraint('profile_reactionlists', 'fk_user_reactionlist_user');
        queryInterface.removeConstraint('profile_reactionlists', 'fk_user_reactionlist_reaction');
    }
};
