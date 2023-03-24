'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('carousel_medialists', { fields: ['media_ID'], type: 'foreign key', name: 'fk_carousel_medialist_media', references: { table: 'media', field: 'ID' } });
        queryInterface.addConstraint('carousel_medialists', { fields: ['carousel_ID'], type: 'foreign key', name: 'fk_carousel_medialist_carousel', references: { table: 'carousels', field: 'ID' } });
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('carousel_medialists', 'fk_medialist_media');
        queryInterface.removeConstraint('carousel_medialists', 'fk_medialist_carousel');
    }
};
