const carousel = require('../models').carousel;
const user = require('../models').user;
const reaction = require('../models').reaction;
const getRandomSubArray = require('../helpers/seeding/array').getRandomMixedArraySlice;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const carouselReactions = [];

        const userIDsRaw = await user.findAll({ attributes: ['ID'] });
        const userIDs = userIDsRaw.map(User => User.ID);

        const carouselIDsRaw = await carousel.findAll({ attributes: ['ID'] });
        const carouselIDs = carouselIDsRaw.map(Carousel => Carousel.ID);

        const reactionIDsRaw = await reaction.findAll({ attributes: ['ID'] });
        const reactionIDs = reactionIDsRaw.map(Reaction => Reaction.ID);

        carouselIDs.forEach(carouselID => {
            userIDs.forEach(userID => {
                var reactions = getRandomSubArray(reactionIDs);
                reactions.forEach(reactionID => {
                    carouselReactions.push({
                        user_ID: userID,
                        carousel_ID: carouselID,
                        reaction_ID: reactionID,
                        date: randomDate("2000-01-01","2022-12-31")
                    });
                });
            });
        });
        await queryInterface.bulkInsert('carousel_reactionlists',carouselReactions);


    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('carousel_reactionlists');
    }
};