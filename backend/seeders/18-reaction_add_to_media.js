const media = require('../models').media;
const user = require('../models').user;
const reaction = require('../models').reaction;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const mediaRections = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        const mediaIDsRaw = await media.findAll({ attributes: ['ID'] });
        const mediaIDs = mediaIDsRaw.map(Media => Media.ID)


        const reactionIDsRaw = await reaction.findAll({ attributes: ['ID'] });
        const reactionIDs = reactionIDsRaw.map(Reaction => Reaction.ID);

        mediaIDs.forEach(mediaID => {
            userIDs.forEach(userID => {
                var makesReactions = Math.random() >= 0.95 ? true : false;

                if (makesReactions) {
                    var reactions = getRandomSubArray(reactionIDs);
                    reactions.forEach(reactionID => {
                        mediaRections.push({
                            user_ID: userID,
                            media_ID: mediaID,
                            reaction_ID: reactionID,
                            date: randomDate("2000-01-01", "2022-12-31")
                        });
                    });
                };
            });
        });
        await queryInterface.bulkInsert('media_reactionlists', mediaRections);


    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('media_reactionlists');
    }
};