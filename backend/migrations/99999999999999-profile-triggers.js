'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        Sequelize.query('DELIMITER' +
            'CREATE TRIGGER UPDATE_PROFILE_ALIAS_IF_NULL_TO_USER_NAME' +
            'AFTER INSERT ON profiles' +
            'FOR EACH ROW' +
            'BEGIN' +
            'DECLARE USERNAME VARCHAR(255)' +
            'IF profiles.alias = NULL' +
            'THEN' +
            'SELECT name INTO USERNAME FROM users WHERE user.ID = new.profile.user_ID' +
            'UPDATE profiles' +
            'SET alias = USERNAME WHERE user_ID = new.user_ID' +
            'END IF' +
            'END'+
            'DELIMITER');
    },
    async down(queryInterface, Sequelize) {
        Sequelize.query('DROP TRIGGER UPDATE_PROFILE_ALIAS_IF_NULL_TO_USER_NAME');
    }
};
