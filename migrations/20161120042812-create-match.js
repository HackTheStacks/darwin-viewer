'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      baseId: {
        type: Sequelize.INTEGER
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      edge: {
        type: Sequelize.STRING
      },
      confidence: {
        type: Sequelize.INTEGER
      },
      votes: {
        type: Sequelize.INTEGER
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Matches');
  }
};
