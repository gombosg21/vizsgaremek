const fs = require('fs');
const http = require('http');
const fake = require('@faker-js/faker');
const user = require('../models').user;
const media = require('../models').media;
const tag = require('../models').tag;
const mediaData = require('../helpers/seeding/image-data');

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const userIDs = await user.findAll({ attributes: ['ID'] });
    const tag_list = await tag.findAll({ attributes: ['ID'] });
    const mediaFiles = await mediaData.getTemp(10);
    if (mediaFiles) {

      for (userID of userIDs) {
        var userUploadCount = Math.floor(Math.random() * 10);

        for (let i = 0; i < userUploadCount; i++) {

          var uploadTagCount = Math.floor(Math.random() * tag_list.length);
          const uploadTagIDList = [];

          while (uploadTagIDList.length < uploadTagCount) {
            var randomTagID = tag_list[Math.round(Math.random() * tag_list.length)].ID;
            if (!uploadTagIDList.includes(randomTagID)) {
              uploadTagIDList.push({ ID: randomTagID });
            };
          };

          console.log(uploadTagIDList);
          var upload = await media.create({
            user_ID: userID.ID,
            file_data: mediaFiles[Math.floor(Math.random() * mediaFiles.length)],
            uploaded: Date.now(),
            description: fake.faker.lorem.lines(),
            visibility: Math.floor(Math.random() * 3),
            placeholder_text: fake.faker.lorem.word(),
          });

          if (uploadTagIDList.length > 0) {

            await upload.set({
              tags: uploadTagIDList
            },
              {
                include: [tag]
              });
          };
        };
      };

    } else {
      throw new Error("mediadata missing");
    };
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('media-taglist');
    await queryInterface.bulkDelete('media');
  }
};
