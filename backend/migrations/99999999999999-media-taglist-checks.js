'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('media_taglists', { fields: ['media_ID','tag_ID'], type: 'unique', name: 'taglist_media_compund_check'});
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('media_taglists', 'taglist_media_compund_check');
    }
};
