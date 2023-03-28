const user = require('../models').user;
const comment = require('../models').comment;
const reaction = require('../models').reaction;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const commentReactions = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        const commentIDsRaw = await comment.findAll({ attributes: ['ID'] });
        const commentIDs = commentIDsRaw.map(Comment => Comment.ID);

        const reactionIDsRaw = await reaction.findAll({ attributes: ['ID'] });
        const reactionIDs = reactionIDsRaw.map(Reaction => Reaction.ID);

        commentIDs.forEach(commentID => {
            userIDs.forEach(userID => {
                var makesReactions = Math.random() >= 0.95 ? true : false;
                
                if (makesReactions) {
                    var reactions = getRandomSubArray(reactionIDs);
                    reactions.forEach(reactionID => {
                        commentReactions.push({
                            user_ID: userID,
                            comment_ID: commentID,
                            reaction_ID: reactionID,
                            date: randomDate("2000-01-01", "2022-12-31")
                        });
                    });
                };
            });
        });
        await queryInterface.bulkInsert('comment_reactionlists', commentReactions);


    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('comment_reactionlists');
    }
};