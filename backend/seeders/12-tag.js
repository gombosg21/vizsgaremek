'use strict';

const fake = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    var tags = [];
    for (let i = 0; i < 10; i++) {
      tags.push({
        name: fake.faker.word.noun()
      });
    };
    await queryInterface.bulkInsert('tags', tags);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
