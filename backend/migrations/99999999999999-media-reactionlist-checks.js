'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('media_reactionlists', { fields: ['media_ID','user_ID','reaction_ID'], type: 'unique', name: 'media_reactionlist_compund_check'});
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('media_reactionlists', 'media_reactionlist_compund_check');
    }
};
