const carousel = require('../models').carousel;
const carousel_medialist = require('../models').carousel_medialist;
const media = require('../models').media;
const user = require('../models').user;
const fake = require('@faker-js/faker');

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
      mediaAssocIDs.push({ [media.user.ID]: media.ID });
    });



    for (ID of userIDs) {
      var uploadIDs = [];
      for (let i = 0; i < mediaAssocIDs.length; i++) {
        var userID = Number(Object.keys(mediaAssocIDs[i]));
        var mediaID = mediaAssocIDs[i][userID];
        if (userID == ID) {
          uploadIDs.push(mediaID);
        };
      };

      const newCarousel = await carousel.create({
        user_ID: ID,
        name: fake.faker.lorem.word(),
        description: fake.faker.lorem.sentences(),
        visibility: Math.floor(Math.random() * 3),
      });

      await newCarousel.setMedia(uploadIDs);
    };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carousel_medialists');
    await queryInterface.bulkDelete('carousels');
  }
};
