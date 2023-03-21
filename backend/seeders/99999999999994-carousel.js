const carousel = require('../models').carousel;
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

    const mediaRaw = await media.findAll({ attributes: ['ID'] });
    const mediaIDs = [];
    mediaRaw.forEach(media => {
      mediaIDs.push(media.ID);
    });



    for (ID of userIDs) {
      const uploadIDs = [];

      const newCarousel = await carousel.create({
        user_ID: ID,
        name: fake.faker.lorem.word(),
        description: fake.faker.lorem.sentences(),
        visibility: Math.floor(Math.random() * 3)
      });
    };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carousels');
  }
};
