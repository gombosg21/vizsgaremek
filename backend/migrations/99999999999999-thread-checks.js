'use strict';
const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('threads', { fields: ['user_ID'], type: 'check', name: 'thread_profile_or_carousel_or_media_notnull_only_check', where: { [Op.or]: [{ 'profile_ID': { [Op.not]: null } }, { 'media_ID': { [Op.not]: null } }, { 'carousel_ID': { [Op.not]: null } }] } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('threads', 'thread_profile_or_carousel_or_media_notnull_only_check');
    }
};
