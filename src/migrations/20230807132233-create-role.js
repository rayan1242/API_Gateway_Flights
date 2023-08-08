'use strict';
/** @type {import('sequelize-cli').Migration} */
const { ENUMS } = require('../utils/common');
const { ADMIN,CUSTOMER,FLIGHT_COMPANY } = ENUMS.USER_ROLE_ENUMS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.ENUM,
        values: [ADMIN,CUSTOMER,FLIGHT_COMPANY],
        defaultValue: CUSTOMER,
        allowNull: false
            },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};