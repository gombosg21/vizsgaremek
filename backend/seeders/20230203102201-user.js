'use strict';

const fake = require("@faker-js/faker");
const migration = require("@sequelize-cli/migration")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    var users = [];
    for (let i = 0; i < 10 ; i++) 
    {
      users.push({
        name : `${fake.name.fullName()}`,
        password: `${fake.internet.password((8 + Math.round(Math.random()*4)),false)}`,
        email: `${fake.internet.email()}`,
        birth_date:`${fake.date.birthdate()}`,
      })
    }
    await queryInterface.bulkInsert('user',users);
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('user');
  }
};
