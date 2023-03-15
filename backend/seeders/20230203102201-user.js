'use strict';

const fake = require("@faker-js/faker");
const generatePassword = require('../util/password').generatePassword;
const fs = require('fs');
// const migration = require("@sequelize-cli/migration")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    var testPasswords = [];

    var users = [];
    for (let i = 0; i < 10; i++) {
      var gender = Math.round(Math.random());
      var genderString = gender ? "male" : "female";
      var firstName = fake.faker.name.firstName(genderString).replace(/\s+/g, '');
      var lastName = fake.faker.name.lastName(genderString).replace(/\s+/g, '');
      var userName = firstName + lastName;
      var passwordUnencryprted = fake.faker.internet.password((8 + Math.round(Math.random() * 4)), false);

      var passwordEncrypted = generatePassword(passwordUnencryprted);
      var passowrdSalt = passwordEncrypted.salt;
      var passwordHash = passwordEncrypted.hash;

      users.push({
        name: userName,
        password_salt: passowrdSalt,
        password_hash: passwordHash,
        email: fake.faker.internet.email(firstName, lastName),
        birth_date: fake.faker.date.birthdate(),
        gender: gender + Math.round(Math.random()),
        profile_visibility: Math.floor(Math.random() * 3),
        profile_description: fake.faker.lorem.sentence()
      });

      testPasswords.push({
        user: userName,
        password: passwordUnencryprted
      });
    }

    fs.writeFile('test_accounts_credentials.json', JSON.stringify(testPasswords), (err) => {
      if (err) { throw err }
      else {
        console.log('test account credentials written.')
      }
    });
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});

    fs.unlink('test_accounts_credentials.json', (err) ={
      if (err) { throw err }
    })
  }
};
