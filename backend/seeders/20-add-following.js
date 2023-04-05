const user = require('../models').user;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //await queryInterface.bulkInsert('followed', threadReactions);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('followed');
    }
};