'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('comment_reactionlists', { fields: ['comment_ID','user_ID','reaction_ID'], type: 'unique', name: 'comment_reactionlist_compund_check'});
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('comment_reactionlists', 'comment_reactionlist_compund_check');

    }
};
