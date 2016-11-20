'use strict';
module.exports = function(sequelize, DataTypes) {
    var Match = sequelize.define('Match', {
        baseId: DataTypes.INTEGER,
        targetId: DataTypes.INTEGER,
        edge: DataTypes.STRING,
        confidence: DataTypes.INTEGER,
        votes: DataTypes.INTEGER,

    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return Match;
};
