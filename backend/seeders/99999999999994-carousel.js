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

    // const newCarousel = await carousel.create({

    // });

    // await newCarousel.setMediaIDs();

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carousels');
  }
};
