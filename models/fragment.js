'use strict';
module.exports = function(sequelize, DataTypes) {
    const Fragment = sequelize.define('Fragment', {
        text: DataTypes.TEXT,
        filename: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Fragment.hasMany(models.Match, { foreignKey: 'baseId', as: 'matches' });
            },
        },
    });
    return Fragment;
};
