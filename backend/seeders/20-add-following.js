const user = require('../models').user;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const followings = [];

        const userIDs = (await user.findAll({ attributes: ['ID'] })).map(User => User.ID);

        userIDs.forEach(ID => {
            var followedIDs = getRandomSubArray(userIDs);
            var followeds = [];
            for (let i = 0; i < followedIDs; i++) {
                if (followedIDs[i] == ID) {
                    followedIDs.splice(i, 1);
                };
                followeds.push({
                    user_ID: ID,
                    followed_ID: followedIDs[i],
                    date: randomDate("2000-01-01", "2022-12-31")
                });
            };
            followings.concat(followeds);
        });

        await queryInterface.bulkInsert('followed', followings);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('followed');
    }
};