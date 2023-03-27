'use strict';
const user = require("../models").user;
const fake = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const userProfiles = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        for (var ID of userIDs) {
            const newProfile = {
                user_ID: ID,
                alias: fake.faker.word.noun(),
                description: fake.faker.lorem.sentences(),
                visibility: Math.floor(Math.random() * 3)
            };
            userProfiles.push(newProfile);
        };
        await queryInterface.bulkInsert('profiles',userProfiles);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('profiles', null, {});
    }
};