'use strict';
const path = require('path');
const frags = require(path.resolve(__dirname + '/../data/a-with-images.json'));

const randomFragId = () => {
    return frags[Math.floor(Math.random() * frags.length)].eid;
}

const data = frags.map((f, i) => ({
    id: i + 1,
    targetId: randomFragId(),
    baseId: randomFragId(),
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
    return queryInterface.bulkInsert('Matches', data, {});
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
