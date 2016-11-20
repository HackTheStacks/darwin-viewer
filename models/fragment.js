'use strict';
module.exports = function(sequelize, DataTypes) {
  var Fragment = sequelize.define('Fragment', {
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Fragment;
};