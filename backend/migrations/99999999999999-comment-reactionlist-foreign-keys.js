'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('comment_reactionlists', { fields: ['comment_ID'], type: 'foreign key', name: 'fk_comment_reactionlist_comment', references: { table: 'comments', field: 'ID' } });
        queryInterface.addConstraint('comment_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_comment_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('comment_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_comment_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('comment_reactionlists', 'fk_comment_reactionlist_comment');
        queryInterface.removeConstraint('comment_reactionlists', 'fk_comment_reactionlist_user');
        queryInterface.removeConstraint('comment_reactionlists', 'fk_comment_reactionlist_reaction');
    }
};
