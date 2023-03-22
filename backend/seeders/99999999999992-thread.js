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
    const userIDs = [];
    userIDsraw.forEach(user => {
      userIDs.push(user.ID)
    });

    const mediaIDsraw = await media.findAll({ attributes: ['ID'] });
    const mediaIDs = [];
    mediaIDsraw.forEach(media => {
      mediaIDs.push(media.ID)
    });
    const mediaThreadCounts = [];

    mediaIDs.forEach(mediaID => {
      var threadCount = Math.floor(Math.random() * 10);
      mediaThreadCounts.push({ [mediaID]: threadCount });
    });

    for (let i = 0; i < mediaThreadCounts.length; i++) {

      const keys = Object.keys(mediaThreadCounts[i]);
      const mediaID = Number(keys[0]);
      const threadCount = mediaThreadCounts[i][mediaID];

      if (threadCount > 0) {
        var a = 0;
        while (a < threadCount) {
          var createdDate = randomDate("1999-01-01", "2020-12-31");
          var uploaderID = userIDs[Math.floor(Math.random() * userIDs.length)];
          var newThread = {
            media_ID: mediaID,
            user_ID: uploaderID,
            name: fake.faker.lorem.sentence(),
            created: createdDate,
            last_activity: createdDate,
          };
          a++;
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
