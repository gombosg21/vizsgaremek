const user = require('../models').user;
const reaction = require('../models').reaction;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const profileReactions = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        const reactionIDsRaw = await reaction.findAll({ attributes: ['ID'] });
        const reactionIDs = reactionIDsRaw.map(Reaction => Reaction.ID);

        userIDs.forEach(targetID => {
            userIDs.forEach(userID => {
                var reactions = getRandomSubArray(reactionIDs);
                reactions.forEach(reactionID => {
                    profileReactions.push({
                        user_ID: userID,
                        profile_ID: targetID,
                        reaction_ID: reactionID,
                        date: randomDate("2000-01-01","2022-12-31")
                    });
                });
            });
        });
        await queryInterface.bulkInsert('user_reactionlists',profileReactions);

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('user_reactionlists');
    }
};