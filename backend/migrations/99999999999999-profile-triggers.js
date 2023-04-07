'use strict';
const db = require("../util/db");
const config = require("../config/config.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        (await db.connection).query(
            'CREATE TRIGGER UPDATE_PROFILE_ALIAS_AFTER_CREATE_IF_NULL_TO_USER_NAME ' +
            'AFTER INSERT ON profiles ' +
            'FOR EACH ROW ' +
            'BEGIN ' +
            'DECLARE USERNAME VARCHAR(255); ' +
            'BEGIN ' +
            'IF NEW.alias = NULL ' +
            'THEN ' +
            'SELECT name INTO USERNAME FROM users WHERE user.ID = NEW.profiles.user_ID; ' +
            'UPDATE profiles ' +
            'SET alias = USERNAME WHERE user_ID = NEW.user_ID; ' +
            'END IF; ' +
            'END; ' +
            'END; '
        );
        (await db.connection).query(
            'CREATE TRIGGER UPDATE_PROFILE_AFTER_UPDATE_ALIAS_IF_NULL_TO_USER_NAME ' +
            'AFTER UPDATE ON profiles ' +
            'FOR EACH ROW ' +
            'BEGIN ' +
            'DECLARE USERNAME VARCHAR(255); ' +
            'BEGIN ' +
            'IF NEW.alias = NULL ' +
            'THEN ' +
            'SELECT name INTO USERNAME FROM users WHERE user.ID = OLD.profiles.user_ID; ' +
            'UPDATE profiles ' +
            'SET alias = USERNAME WHERE user_ID = OLD.user_ID; ' +
            'END IF; ' +
            'END; ' +
            'END; '
        );
    },

    async down(queryInterface, Sequelize) {
        (await db.connection).query('DROP TRIGGER UPDATE_PROFILE_ALIAS_AFTER_CREATE_IF_NULL_TO_USER_NAME');
        (await db.connection).query('DROP TRIGGER UPDATE_PROFILE_AFTER_UPDATE_ALIAS_IF_NULL_TO_USER_NAME');
    }
};
