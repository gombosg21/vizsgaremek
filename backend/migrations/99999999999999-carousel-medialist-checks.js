'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('carousel_medialists', { fields: ['carousel_ID', 'item_number'], type: 'unique', name: 'carousel_medialists_carousel_id_item_number_combo_unique'});
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('carousel_medialists', 'carousel_medialists_carousel_id_item_number_combo_unique');
    }
};
