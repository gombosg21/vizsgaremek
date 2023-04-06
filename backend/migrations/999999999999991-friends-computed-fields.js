'use strict';
const db = require("../util/db");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        (await db.connection).query("ALTER TABLE friends ADD friends_unique_computed_key varchar(255) GENERATED ALWAYS AS ( CONCAT( LEAST( friends.user_ID, friends.friend_ID ) , '_' , GREATEST( friends.user_ID , friends.friend_ID ))) STORED; ");
    },
    async down(queryInterface, Sequelize) {
        //
    }
};
