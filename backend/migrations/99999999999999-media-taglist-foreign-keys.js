'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addConstraint('media_taglists', { fields: ['media_ID'], type: 'foreign key', name: 'fk_taglist_media', references: { table: 'media', field: 'ID' } }),
            queryInterface.addConstraint('media_taglists', { fields: ['tag_ID'], type: 'foreign key', name: 'fk_taglist_tag', references: { table: 'tags', field: 'ID' } })
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('media_taglists', 'fk_taglist_media'),
            queryInterface.removeConstraint('media_taglists', 'fk_taglist_tag')
    }
};
