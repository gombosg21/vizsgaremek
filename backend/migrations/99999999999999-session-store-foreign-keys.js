'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) { 
        queryInterface.addConstraint('session_stores',{fields:['user_ID'],type:'foreign key',name:'fk_sessions_user',references:{table:'users',field:'ID'}})
    },
    async down(queryInterface, Sequelize) {
        queryInterface.removeConstraint('session_stores','fk_sessions_user')
    }
};
