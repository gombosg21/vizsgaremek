'use strict';
const { Op } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('activity', { fields: ['user_ID'], type: 'check', where: { [Op.or]: [{ 'followed_ID': { [Op.not]: null } }, { 'friend_ID': { [Op.not]: null } }] }, name: 'activity_check' });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('activity', 'activity_check');
    }
};
