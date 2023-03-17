'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('carousel_reactionlists', { fields: ['carousel_ID'], type: 'foreign key', name: 'fk_carousel_reactionlist_media', references: { table: 'carousel', field: 'ID' } });
        queryInterface.addConstraint('carousel_reactionlists', { fields: ['user_ID'], type: 'foreign key', name: 'fk_carousel_reactionlist_user', references: { table: 'users', field: 'ID' } });
        queryInterface.addConstraint('carousel_reactionlists', { fields: ['reaction_ID'], type: 'foreign key', name: 'fk_carousel_reactionlist_reaction', references: { table: 'reactions', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('carousel_reactionlists', 'fk_carousel_reactionlist_media');
        queryInterface.removeConstraint('carousel_reactionlists', 'fk_carousel_reactionlist_user');
        queryInterface.removeConstraint('carousel_reactionlists', 'fk_carousel_reactionlist_reaction');
    }
};
