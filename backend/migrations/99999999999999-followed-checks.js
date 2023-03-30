'use strict';
const { Op, col } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('followed', { fields: ['user_ID', 'followed_ID'], type: 'unique', name: 'followed_compound_check' });
        queryInterface.addConstraint('followed', { fields: ['user_ID', 'followed_ID'], type: 'check', where: { 'user_ID': { [Op.ne]: col('followed_ID') } }, name: 'followed_no_self_follow' })
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('followed', 'followed_compound_check');
        queryInterface.removeConstraint('followed', 'followed_no_self_follow');
    }
};
