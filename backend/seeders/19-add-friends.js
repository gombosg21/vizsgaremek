const user = require('../models').user;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const friends = [];

        const userIDs = (await user.findAll({ attributes: ['ID'] })).map(User => User.ID);

        userIDs.forEach(ID => {
            var userFriendIDs = getRandomMixedArraySlice(userIDs);
            var userFriends = [];

            for (let i = 0; i < userFriendIDs.length; i++) {
                if (userFriendIDs[i] == ID) {
                    userFriendIDs.splice(i,1);
                };
                userFriends.push({
                    user_ID: ID,
                    friend_ID: userFriendIDs[i],
                    pending : Math.round(Math.random()) = 1 ? true : false,
                    date: randomDate("2000-01-01","2022-12-31")
                });
            };
            friends.concat(userFriends);
        });

        for (let i = 0; i < friends.length; i++) {
            
        };

        await queryInterface.bulkInsert('friends', friends);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('friends');
    }
};