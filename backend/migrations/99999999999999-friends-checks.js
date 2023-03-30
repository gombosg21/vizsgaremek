'use strict';
const { Op, col } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('friends', { fields: ['user_ID', 'friend_ID'], type: 'check', where: { 'user_ID': { [Op.ne]: col('friend_ID') } }, name: 'friends_no_self_friend' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('friends', 'friends_no_self_friend');
    }
};
