'use strict';

const fakeData = Array.apply(null, { length: 50 }).map((v, i) => i + 1).map((v, i) => (
    {
        id: i,
        filename: `paper-${( i % 3 ) + 1}.jpg`,
        text: `This is the ${v} note`,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
));

module.exports = {
    up: function(queryInterface, Sequelize) {
        /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
    }], {});
    */
    return queryInterface.bulkInsert('Fragments', fakeData, {});
},

down: function(queryInterface, Sequelize) {
    /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Fragments', null, {});
},
};
