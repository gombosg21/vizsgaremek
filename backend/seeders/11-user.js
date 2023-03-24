'use strict';
const randomDate = require("../helpers/seeding/date").getRandomDate;
const fake = require("@faker-js/faker");
const encryptPassword = require("../util/auth").generatePassword;
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const testPasswords = [];

    const users = [];
    for (let i = 0; i < 10; i++) {
      var gender = Math.round(Math.random());
      var genderString = gender ? "male" : "female";
      var firstName = fake.faker.name.firstName(genderString).replace(/\s+/g, '');
      var lastName = fake.faker.name.lastName(genderString).replace(/\s+/g, '');
      var userName = firstName + lastName;
      var password = fake.faker.internet.password((8 + Math.round(Math.random() * 4)), false);
      var userAlias = fake.faker.word.noun();
      ;

      users.push({
        name: userName,
        alias: userAlias,
        password: await encryptPassword(password),
        email: fake.faker.internet.email(firstName, lastName),
        birth_date: fake.faker.date.birthdate(),
        register_date : randomDate("2015-01-01","2022-12-31"),
        gender: gender + Math.round(Math.random()),
        profile_visibility: Math.floor(Math.random() * 3),
        profile_description: fake.faker.lorem.sentence()
      });

      testPasswords.push({
        name: userName,
        password: password
      });
    };

    fs.appendFile('test_accounts_credentials.json', JSON.stringify(testPasswords), async () => {
      console.log('test account credentials written.');
      await queryInterface.bulkInsert('users', users);
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});

    fs.unlink('test_accounts_credentials.json', (err) => {
      if (err) { throw err }
      console.log("test account credentials destoryed");
    });
  }
};
