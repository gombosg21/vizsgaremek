'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { 
        queryInterface.addConstraint('threads',{fields:['user_ID'],type:'foreign key',name:'fk_thread_user',references:{table:'users',field:'ID'}}),
        queryInterface.addConstraint('threads',{fields:['media_ID'],type:'foreign key',name:'fk_thread_media',references:{table:'media',field:'ID'}})
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('threads','fk_thread_user'),
        queryInterface.removeConstraint('threads','fk_thread_media')
    }
};
