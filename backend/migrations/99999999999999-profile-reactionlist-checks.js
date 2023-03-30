'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('profile_reactionlists', { fields: ['profile_ID','user_ID','reaction_ID'], type: 'unique', name: 'profile_reactionlist_compound_check'});
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('profile_reactionlists', 'profile_reactionlist_compound_check');
    }
};
