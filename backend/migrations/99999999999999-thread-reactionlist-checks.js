'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('thread_reactionlists', { fields: ['thread_ID','user_ID','reaction_ID'], type: 'unique', name: 'thread_reactionlist_compound_check'});
},
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('thread_reactionlists', 'thread_reactionlist_compound_check');

    }
};
