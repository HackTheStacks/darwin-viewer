'use strict';
module.exports = function(sequelize, DataTypes) {
    const Fragment = sequelize.define('Fragment', {
        text: DataTypes.TEXT,
        filename: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Fragment.hasMany(models.Match, { as: 'matches', foreignKey: 'baseId' });
            },
        },
    });
    return Fragment;
};
