const fake = require('@faker-js/faker');
const user = require('../models').user;
const media = require('../models').media;
const tag = require('../models').tag;
const mediaData = require('../helpers/seeding/image-data');
const toBase64 = require('../util/serialize-file').getBase64;

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const userIDs = await user.findAll({ attributes: ['ID'] });
    const tag_list = await tag.findAll({ attributes: ['ID'] });
    const rawMediaFiles = await mediaData.getTemp(10);
    const mediaFiles = []

    for (var Media of rawMediaFiles) {
      base64Media = await toBase64(Buffer.from(await Media.arrayBuffer()));
      mediaFiles.push(base64Media);
    };

    if (mediaFiles) {

      for (let i = 0; i < userIDs.length; i++) {
        var userUploadCount = Math.floor(Math.random() * 10);

        var userID = userIDs[i].ID;

        for (let i = 0; i < userUploadCount; i++) {
          var uploadTagCount = Math.floor(Math.random() * tag_list.length);
          var uploadTagIDList = [];

          while (uploadTagIDList.length < uploadTagCount) {
            var randomTagID = tag_list[Math.floor(Math.random() * tag_list.length)].ID;
            if (!uploadTagIDList.includes(randomTagID)) {
              uploadTagIDList.push(randomTagID);
            };
          };

          var upload = await media.create({
            user_ID: userID,
            file_data: mediaFiles[Math.floor(Math.random() * mediaFiles.length)],
            uploaded: Date.now(),
            description: fake.faker.lorem.lines(),
            visibility: Math.floor(Math.random() * 3),
            placeholder_text: fake.faker.lorem.word(),
          });

          await upload.setTags(uploadTagIDList);

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
