'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('thread_reactionlists', { fields: ['thread_ID'], type: 'foreign key', name: 'fk_thread_reactionlist_media', references: { table: 'threads', field: 'ID' } });
        queryInterface.addConstraint('thread_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_thread_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('thread_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_thread_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('thread_reactionlists', 'fk_thread_reactionlist_media');
        queryInterface.removeConstraint('thread_reactionlists', 'fk_thread_reactionlist_user');
        queryInterface.removeConstraint('thread_reactionlists', 'fk_thread_reactionlist_reaction');
    }
};
