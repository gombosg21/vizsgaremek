const user = require('../models').user;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const followings = [];

        // this gets called for every iteration, thats a no-no!
        var userIDs = [];
        userIDs = (await user.findAll({ attributes: ['ID'] })).map(User => User.ID);

        for (let i = 0; i < userIDs.length; i++) {
            console.log(userIDs);
            var followedIDs = getRandomSubArray(userIDs);
            followedIDs.forEach(followedID => {
                if (userIDs[i] != followedID) {
                    followings.push({
                        user_ID: userIDs[i],
                        followed_ID: followedID,
                        date: randomDate("2000-01-01", "2022-12-31")
                    });
                };
            });
        };

        console.log(followings);

        //await queryInterface.bulkInsert('followed', followings);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('followed');
    }
};