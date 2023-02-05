'use strict';

const fake = require("@faker-js/faker");
// const migration = require("@sequelize-cli/migration")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    var users = [];
    for (let i = 0; i < 10 ; i++) 
    {
      users.push({
        name : fake.faker.name.fullName(),
        password: fake.faker.internet.password((8 + Math.round(Math.random()*4)),false),
        email: fake.faker.internet.email(),
        birth_date: fake.faker.date.birthdate(),
        gender: Math.round(Math.random()*2)
      })
    }
    await queryInterface.bulkInsert('users',users);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users',null,{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
