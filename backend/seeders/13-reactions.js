const mediaData = require('../helpers/seeding/image-data');
const toBase64 = require('../util/serialize-file').getBase64;
const fake = require('@faker-js/faker');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const reactionList = [];

        const reactionsData = await mediaData.getImgFolder(10, "./temp/reaction-data");

        const mediaFiles = []

        for (let i = 0; i < reactionsData.length; i++) {

            var base64Media = await toBase64(Buffer.from(await reactionsData[i].arrayBuffer()));
            mediaFiles.push(base64Media);
        };

        if (mediaFiles.length != 0) {
            mediaFiles.forEach(Base64File => {

                const newReaction = {
                    name: fake.faker.word.noun(),
                    data: Base64File
                };
                reactionList.push(newReaction);
            });
        };

        await queryInterface.bulkInsert('reactions', reactionList);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('reactions');
    }
};