'use strict';

const fakeMatches = Array.apply(null, { length: 50 })
.map((v, i) => i + 1)
.map((v) => ({
    id: v,
    targetId: Math.floor(Math.random() * 50),
    baseId: Math.floor(Math.random() * 50),
    votes: Math.floor(Math.random() * 20),
    confidence: Math.floor(Math.random() * 30),
    edge: (['N', 'S', 'E', 'W'])[Math.round(Math.random() * 4)],
    createdAt: new Date(),
    updatedAt: new Date(),
}));

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
    return queryInterface.bulkInsert('Matches', fakeMatches);
},

down: function(queryInterface, Sequelize) {
    /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Matches', null, {});
},
};
