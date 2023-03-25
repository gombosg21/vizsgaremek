const fake = require('@faker-js/faker');
const user = require('../models').user;
const carousel = require('../models').carousel;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const Threads = [];

    const userIDsraw = await user.findAll({ attributes: ['ID', 'alias', 'register_date'] });
    const userIDs = userIDsraw.map(User => User.ID);

    const carouselsRaw = await carousel.findAll({ attributes: ['ID'] });
    const carouselThreadCounts = [];
    carouselsRaw.forEach(Carousel => {
      var threadCount = Math.floor(Math.random() * 10);
      carouselThreadCounts.push({ thread: { target_ID: Carousel.ID, count: threadCount } });
    });


    for (let i = 0; i < carouselThreadCounts.length; i++) {
      const carouselID = carouselThreadCounts[i].thread.target_ID;
      const threadCount = carouselThreadCounts[i].thread.count;
      var createdDate = randomDate("1999-01-01", "2020-12-31");
      var uploaderID = userIDs[Math.floor(Math.random() * userIDs.length)];

      if (threadCount > 0) {
        for (let i = 0; i < threadCount; i++) {
          var newThread = {
            carousel_ID: carouselID,
            user_ID: uploaderID,
            name: fake.faker.lorem.sentence(),
            created: createdDate,
            last_activity: createdDate,
          };
          Threads.push(newThread);
        };
      };
    };
    await queryInterface.bulkInsert('threads', Threads);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('threads');
  }
};
