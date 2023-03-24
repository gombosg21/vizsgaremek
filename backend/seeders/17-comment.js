const thread = require('../models').thread;
const user = require('../models').user;
const fake = require('@faker-js/faker');
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const comments = [];

    const threadIDsraw = await thread.findAll();
    const threadDateAssocArray = [];

    threadIDsraw.forEach(thread => {
      threadDateAssocArray.push({ [thread.ID]: thread.created })
    });

    const userIDsraw = await user.findAll({ attributes: ['ID'] });
    const userIDs = [];
    userIDsraw.forEach(user => {
      userIDs.push(user.ID)
    });

    const threadCommentCounts = [];


    for (let i = 1; i < threadDateAssocArray.length; i++) {
      var rawCommentCount = Math.floor(Math.random() * 10)
      var commentCount = rawCommentCount > 0 ? rawCommentCount : 1;
      threadCommentCounts.push({ [Object.keys(threadDateAssocArray[i])[0]]: commentCount });
    };

    for (let i = 0; i < threadCommentCounts.length; i++) {

      const keys = Object.keys(threadCommentCounts[i]);
      const threadID = Number(keys[0]);
      var threadDate = threadDateAssocArray.threadID;
      const commentCount = threadCommentCounts[i][threadID];


      for (let i = 0; i < commentCount; i++) {
        var commentCreateDate = randomDate("1999-01-01", "2020-12-31");
        var commentEditDateRaw = randomDate("1999-01-01", "2020-12-31");
        var commentEditDate = commentEditDateRaw > commentCreateDate ? commentEditDateRaw : commentCreateDate;
        var commenterID = userIDs[Math.floor(Math.random() * userIDs.length)];
        if (threadDate < commentEditDate) {
          threadDate = commentEditDate;
        };
        var newComment = {
          thread_ID: threadID,
          user_ID: commenterID,
          content: fake.faker.lorem.paragraph(),
          created: commentCreateDate,
          last_edit: commentEditDate,
        };
        comments.push(newComment);
      };
      await thread.update({ last_activity: threadDate }, { where: { ID: threadID } })
    };

    await queryInterface.bulkInsert('comments', comments);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments');
  }
};
