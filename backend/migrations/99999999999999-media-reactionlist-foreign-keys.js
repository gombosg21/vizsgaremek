'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('media_reactionlists', { fields: ['media_ID'], type: 'foreign key', name: 'fk_media_reactionlist_media', references: { table: 'media', field: 'ID' } });
        queryInterface.addConstraint('media_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_media_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('media_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_media_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('media_reactionlists', 'fk_media_reactionlist_media');
        queryInterface.removeConstraint('media_reactionlists', 'fk_media_reactionlist_user');
        queryInterface.removeConstraint('media_reactionlists', 'fk_media_reactionlist_reaction');
    }
};
