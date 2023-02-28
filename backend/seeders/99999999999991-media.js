const fs = require('fs');
const http = require('http');
const fake = require('@faker-js/faker');
const user = require('../models/user');
const media = require('../models/media');
const tag = require('../models/tag');

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    var mediaArray = [];
    var userIDs = await user.findAll({ attributes: ['ID'] });
    var tags = await tag.findAll({ attributes: ['ID'] });
    var mediaFiles = [];




    userIDs.forEach(async userID => {
      var userUploadCount = Math.floor(Math.random() * 10);

      for (let i = 0; i < userUploadCount; i++) {

        var uploadTagCount = Math.floor(Math.random() * tags.length);
        var uploadTagIDList = [];

        while (uploadTagIDList.length < uploadTagCount) {
          var randomTagID = tags[Math.round(Math.random() * tags.length)];
          if (!uploadTagIDList.includes(randomTagID)) {
            uploadTagIDList.push({ID:randomTagID});
          };
        };

          var upload = await media.create({
            user_ID: userID,
            file_data: mediaFiles[Math.floor(Math.random() * mediaFiles.length)],
            uploaded: Date.now(),
            description: fake.faker.lorem.lines(),
            visibility: Math.floor(Math.random() * 3),
            placeholder_text: fake.faker.lorem.word(),
            tag: uploadTagIDList,
            include: [{
              association: tag
            }]
          });
          mediaArray.push(upload);
      };
    });

    await queryInterface.bulkInsert('media',mediaArray);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('media-taglist');
    await queryInterface.bulkDelete('media');
  }
};
