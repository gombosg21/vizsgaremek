'use strict';

const fake = require("@faker-js/faker");
// const migration = require("@sequelize-cli/migration")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    var users = [];
    for (let i = 0; i < 10 ; i++) 
    {
      var gender = Math.round(Math.random());
      var genderString = gender ? "male" : "female" ;
      var firstName = fake.faker.name.firstName(genderString).replace(/\s+/g, '');
      var lastName = fake.faker.name.lastName(genderString).replace(/\s+/g, '');

      users.push({
        name : firstName + lastName,
        password: fake.faker.internet.password((8 + Math.round(Math.random()*4)),false),
        email: fake.faker.internet.email(firstName,lastName),
        birth_date: fake.faker.date.birthdate(),
        gender: gender + Math.round(Math.random())
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
