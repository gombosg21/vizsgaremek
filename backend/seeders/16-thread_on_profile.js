const profile = require('../models').profile;
const user = require('../models').user;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const Threads = [];

    const userIDsraw = await user.findAll({ attributes: ['ID', 'register_date'] , include:[{model:profile, attributes:['alias']}]});

    for (let i = 0; i < userIDsraw.length; i++) {
      var uploaderID = userIDsraw[i].ID;
      var newThread = {
        profile_ID: uploaderID,
        user_ID: uploaderID,
        name: userIDsraw[i].profile.alias + "'s profile thread",
        created: userIDsraw[i].register_date,
        last_activity: userIDsraw[i].register_date,
      };
      Threads.push(newThread);
    };
    await queryInterface.bulkInsert('threads', Threads);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('threads');
  }
};
