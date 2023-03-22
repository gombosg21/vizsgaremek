const carousel = require('../models').carousel;
const media = require('../models').media;
const user = require('../models').user;
const fake = require('@faker-js/faker');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        const usersRaw = await user.findAll();

    },
    async down(queryInterface, Sequelize) {
        // await queryInterface.bulkDelete();
        // await queryInterface.bulkDelete();
        // await queryInterface.bulkDelete();
        // await queryInterface.bulkDelete();
        // await queryInterface.bulkDelete();
    }
};