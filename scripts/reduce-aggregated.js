const fs = require('fs');
const path = require('path');
const aggregated = require('../data/aggregated.json');

const withImages = aggregated.filter((a) => {
    try {
        fs.lstatSync(path.resolve(__dirname + '/../data/images/' + a.filename));
        return true;
    } catch(e) {
        return false;
    }
});

fs.writeFileSync(path.resolve(__dirname + '/../data/a-with-images.json'), JSON.stringify(withImages, null, 4));
