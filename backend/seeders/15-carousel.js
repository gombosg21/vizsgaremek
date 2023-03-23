const carousel = require('../models').carousel;
const media = require('../models').media;
const user = require('../models').user;
const fake = require('@faker-js/faker');
const mixedArraySilce = require('../helpers/seeding/array').getRandomMixedArraySlice;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersRaw = await user.findAll({ attributes: ['ID'] });

    const userIDs = [];
    usersRaw.forEach(user => {
      userIDs.push(user.ID);
    });

    const mediaAssocIDs = [];
    const mediaRaw = await media.findAll({ include: { model: user } });
    mediaRaw.forEach(media => {
      mediaAssocIDs.push({ [media.user.ID]: media.ID, visibility: media.visibility });
    });



    for (ID of userIDs) {
      var randomNum = Math.floor(Math.random() * 10)
      var carouselCount = randomNum > 1 ? randomNum : 1;
      var userMediaIDs = [];
      var visibility = 3;
      for (let i = 0; i < mediaAssocIDs.length; i++) {
        var userID = Number(Object.keys(mediaAssocIDs[i])[0]);
        var mediaID = mediaAssocIDs[i][userID];
        if (userID == ID) {
          userMediaIDs.push(mediaID);
          if (mediaAssocIDs[i].visibility < visibility)
            visibility = mediaAssocIDs[i].visibility;
        };
      };

      for (let i = 0; i < carouselCount; i++) {
        var storyMediasRaw = mixedArraySilce(userMediaIDs);
        var storyMedias = [];
        for (let i = 0; i< storyMediasRaw.length; i++) {
          storyMedias.push({
            ID: storyMediasRaw[i],
            item_number : i,
            item_description : fake.faker.lorem.sentences()
          });
        };
        const newCarousel = await carousel.create({
          user_ID: ID,
          name: fake.faker.lorem.word(),
          description: fake.faker.lorem.sentences(),
          visibility: visibility,
        });
        await newCarousel.setMedia(storyMedias);
      };
    };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carousel_medialists');
    await queryInterface.bulkDelete('carousels');
  }
};
