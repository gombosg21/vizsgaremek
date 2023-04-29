const fake = require('@faker-js/faker');
const user = require('../models').user;
const media = require('../models').media;
const tag = require('../models').tag;
const mediaData = require('../helpers/seeding/image-data');
const toBase64 = require('../util/serialize-file').getBase64;
const randomDate = require('../helpers/seeding/date').getRandomDate;
const mixedArraySilce = require('../helpers/seeding/array').getRandomMixedArraySlice;

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const userIDs = await user.findAll({ attributes: ['ID'] });
    const tagListRaw = await tag.findAll({ attributes: ['ID'] });
    const tagIDList = tagListRaw.map(Tag => Tag.ID);

    const rawMediaFiles = await mediaData.getImgFolder(10, "./temp/media_data");
    const mediaFiles = []

    for (var Media of rawMediaFiles) {
      var base64Media = await toBase64(Buffer.from(await Media.arrayBuffer()));
      mediaFiles.push(base64Media);
    };

    if (mediaFiles.length != 0) {
      for (let i = 0; i < userIDs.length; i++) {
        var userUploadCount = Math.floor(Math.random() * 10);
        var userID = userIDs[i].ID;

        for (let i = 0; i < userUploadCount; i++) {
          var uploadTagIDList = mixedArraySilce(tagIDList);
          var uploadDate = randomDate("1999-01-01", "2020-12-31");

          var upload = await media.create({
            user_ID: userID,
            file_data: mediaFiles[Math.floor(Math.random() * mediaFiles.length)],
            uploaded: Date.now(),
            description: fake.faker.lorem.lines(),
            visibility: Math.floor(Math.random() * 3),
            placeholder_text: fake.faker.lorem.word(),
            uploaded: uploadDate
          });
          await upload.setTags(uploadTagIDList);
        };
      };
    } else {
      throw new Error("mediadata missing");
    };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('media_taglists');
    await queryInterface.bulkDelete('media');
  }
};
