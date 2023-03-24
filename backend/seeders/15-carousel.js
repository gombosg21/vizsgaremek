const carousel = require('../models').carousel;
const carousel_medialist = require('../models').carousel_medialist;
const media = require('../models').media;
const user = require('../models').user;
const fake = require('@faker-js/faker');
const mixedArraySilce = require('../helpers/seeding/array').getRandomMixedArraySlice;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const mediasRaw = await media.findAll({ include: { model: user, attributes: ['ID'] }, attributes: ['ID', 'visibility'] });
    const uploaders = [];
    const medias = [];

    mediasRaw.forEach(media => {
      if (!(uploaders.includes(media.user.ID))) { uploaders.push(media.user.ID) }
    });

    uploaders.forEach(ID => {
      medias.push({ user: { ID: ID, medias: [] } });
    });

    for (let j = 0; j < medias.length; j++) {
      for (let i = 0; i < mediasRaw.length; i++) {
        if (mediasRaw[i].user.ID == medias[j].user.ID) {
          medias[j].user.medias.push({ ID: mediasRaw[i].ID, visibility: mediasRaw[i].visibility });
        };
      };
    };


    for (let i = 0; i < medias.length; i++) {
      var visibility = 3;
      var userID = medias[i].user.ID;
      var userMediaIDs = [];
      medias[i].user.medias.forEach(media => {
        userMediaIDs.push(media.ID);
        if (visibility > media.visibility) { visibility = media.visibility; };
      });

      if (userMediaIDs.length > 2) {
        var randomNum = Math.floor(Math.random() * (userMediaIDs.length * 2));
        var carouselCount = randomNum > 1 ? randomNum : 1;
        
        for (let j = 0; j < carouselCount; j++) {
          var storyMediasID = mixedArraySilce(userMediaIDs);

          const Carousel = await carousel.create({
            user_ID: userID,
            name: fake.faker.lorem.word(),
            description: fake.faker.lorem.sentences(),
            visibility: visibility,
          });

          var storyMedias = [];
          for (let z = 0; z < storyMediasID.length; z++) {
            storyMedias.push({
              media_ID: storyMediasID[z],
              carousel_ID: Carousel.ID,
              item_number: z,
              item_description: fake.faker.lorem.sentences()
            });
          };
          await carousel_medialist.bulkCreate(storyMedias);
        };
      };
    };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carousel_medialists');
    await queryInterface.bulkDelete('carousels');
  }
};
