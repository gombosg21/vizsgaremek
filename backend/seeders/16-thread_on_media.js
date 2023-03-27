const fake = require('@faker-js/faker');
const user = require('../models').user;
const media = require('../models').media;
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const Threads = [];

    const userIDsraw = await user.findAll({ attributes: ['ID'] });
    const userIDs = userIDsraw.map(User => User.ID);

    const mediaIDsraw = await media.findAll({ attributes: ['ID'] });
    const mediaThreadCounts = [];
    mediaIDsraw.forEach(Media => {
      var threadCount = Math.floor(Math.random() * 10);
      mediaThreadCounts.push({ thread: { target_ID: Media.ID, count: threadCount } });
    });

    for (let i = 0; i < mediaThreadCounts.length; i++) {
      const mediaID = mediaThreadCounts[i].thread.target_ID;
      const threadCount = mediaThreadCounts[i].thread.count;

      if (threadCount > 0) {
        for (let i = 0; i < threadCount; i++) {
          var createdDate = randomDate("1999-01-01", "2020-12-31");
          var uploaderID = userIDs[Math.floor(Math.random() * userIDs.length)];
          var newThread = {
            media_ID: mediaID,
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
