const thread = require('../models').thread;
const user = require('../models').user;
const fake = require('@faker-js/faker');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const comments = [];

    const threadIDsraw = await thread.findAll({ attributes: ['ID'] });
    const threadIDs = [];

    threadIDsraw.forEach(thread => {
      threadIDs.push(thread.ID)
    });

    const userIDsraw = await user.findAll({ attributes: ['ID'] });
    const userIDs = [];
    userIDsraw.forEach(user => {
      userIDs.push(user.ID)
    });

    const threadCommentCounts = [];

    threadIDs.forEach(threadID => {
      var ravCommentCount = Math.floor(Math.random() * 10)
      var commentCount = ravCommentCount > 0 ? ravCommentCount : 1;
      threadCommentCounts.push({ [threadID]: commentCount });
    });

    for (let i = 0; i < threadCommentCounts.length; i++) {

      const keys = Object.keys(threadCommentCounts[i]);
      const threadID = Number(keys[0]);
      const commentCount = threadCommentCounts[i][threadID];

      var a = 0;
      while (a < commentCount) {
        const commenterID = userIDs[Math.floor(Math.random() * userIDs.length)];
        const newComment = {
          thread_ID: threadID,
          user_ID: commenterID,
          content: fake.faker.lorem.paragraph()
        };
        a++;
        comments.push(newComment);
      };
    };

    await queryInterface.bulkInsert('comments',comments);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete();
  }
};
