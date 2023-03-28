const user = require('../models').user;
const thread = require('../models').thread;
const reaction = require('../models').reaction;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const threadReactions = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        const threadIDsRaw = await thread.findAll({ attributes: ['ID'] });
        const threadIDs = threadIDsRaw.map(Thread => Thread.ID);

        const reactionIDsRaw = await reaction.findAll({ attributes: ['ID'] });
        const reactionIDs = reactionIDsRaw.map(Reaction => Reaction.ID);

        threadIDs.forEach(threadID => {
            userIDs.forEach(userID => {
                var makesReactions = Math.random() >= 0.95 ? true : false;

                if (makesReactions) {
                    var reactions = getRandomSubArray(reactionIDs);
                    reactions.forEach(reactionID => {
                        threadReactions.push({
                            user_ID: userID,
                            thread_ID: threadID,
                            reaction_ID: reactionID,
                            date: randomDate("2000-01-01", "2022-12-31")
                        });
                    });
                };
            });
        });
        await queryInterface.bulkInsert('thread_reactionlists', threadReactions);

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('thread_reactionlists');
    }
};