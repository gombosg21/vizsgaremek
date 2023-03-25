const thread = require('../models').thread;
const user = require('../models').user;
const fake = require('@faker-js/faker');
const randomDate = require('../helpers/seeding/date').getRandomDate;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const comments = [];

    const userIDsraw = await user.findAll({ attributes: ['ID'] });
    const userIDs = userIDsraw.map(User => User.ID);

    const threadIDsraw = await thread.findAll({ attributes: ['ID', 'last_activity'] });

    const threadAssocArray = [];
    threadIDsraw.forEach(thread => {
      var rawCommentCount = Math.floor(Math.random() * 10)
      var commentCount = rawCommentCount > 0 ? rawCommentCount : 1;
      threadAssocArray.push({ thread: { ID: thread.ID, last_activity: thread.last_activity, commentCount: commentCount } });
    });

    for (let i = 0; i < threadAssocArray.length; i++) {
      var threadDate = threadAssocArray[i].thread.last_activity;
      var commentCount = threadAssocArray[i].thread.commentCount;
      var threadID = threadAssocArray[i].thread.ID;

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
      const Thread = await thread.findByPk(threadID);
      await Thread.update({ last_activity: threadDate });
    };

    await queryInterface.bulkInsert('comments', comments);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments');
  }
};
