'use strict';
const followed = require("../models").followed;
const friend = require("../models").friends;
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const activityAssociations = [];

        const allFollowed = await followed.findAll({ order: ['user_ID'] });
        const allFriends = await friend.findAll({ where: { pending: false }, order: ['user_ID'] });

        allFollowed.forEach(Followed => {
            activityAssociations.push({
                user_ID : Followed.user_ID,
                followed_ID : Followed.followed_ID,
                friend_ID : null
            });
        });

        allFriends.forEach(Friend => {
            activityAssociations.push({
                user_ID: Friend.user_ID,
                friend_ID: Friend.friend_ID,
                followed_ID: null
            });
            activityAssociations.push({
                user_ID: Friend.friend_ID,
                friend_ID: Friend.user_ID,
                followed_ID: null
            });
        });

        await queryInterface.bulkInsert('activity', activityAssociations);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('activity');
    }
};