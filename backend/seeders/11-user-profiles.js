'use strict';
const user = require("../models").user;
const fake = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const userProfiles = [];

        const userIDsRaw = await user.findAll();

        const userIDs = userIDsRaw.map(User => User.ID);

        for (var ID of userIDs) {
            var alias = fake.faker.lorem.word();
            var description = fake.faker.lorem.sentences();
            var visibility = Math.floor(Math.random() * 3);
            const newProfile = {
                user_ID: ID,
                alias: alias,
                description: description,
                visibility: visibility
            };
            userProfiles.push(newProfile);
        };
        await queryInterface.bulkInsert('profiles',userProfiles);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('profiles', null, {});
    }
};