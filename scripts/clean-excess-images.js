const fs = require('fs');
const path = require('path');
const fragsWithImages = require('../data/a-with-images.json');

const imgTable = fragsWithImages.reduce((merged, t) => {
    merged[t.filename] = true;
    return merged;
}, {});

const imgs = fs.readdirSync(path.resolve(__dirname + '/../data/images'));

imgs.forEach((file) => {
    if (!imgTable[file]) {
        fs.unlinkSync(path.resolve(__dirname + '/../data/images/' + file));
        console.log(file);
    }
});
