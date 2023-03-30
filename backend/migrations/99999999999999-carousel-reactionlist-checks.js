'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('carousel_reactionlists', { fields: ['reaction_ID', 'user_ID', 'carousel_ID'], type: 'unique', name: 'carousel_reactionlist_compound_unique_check' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('carousel_reactionlists', 'carousel_reactionlist_compound_unique_check');
    }
};
