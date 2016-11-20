'use strict';
module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define('Match', {
    base_id: DataTypes.INTEGER,
    target_id: DataTypes.INTEGER,
    edge: DataTypes.STRING,
    confidence: DataTypes.INTEGER,
    votes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Match;
};