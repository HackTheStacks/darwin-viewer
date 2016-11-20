const csvParser = require('csv').parse;
const htmlParser = require('htmlparser2');

const buildHtmlParser = (destObj) => {
    return new htmlParser.Parser({
        ontext: (text) => {
            if (text && text.trim()) {
                destObj.text += text.replace(/\s+/g, ' ').replace(/\\n+/g, '').replace(/nil/g, '');
            }
        },
    }, { decodeEntities: true });
};

const fs = require('fs');

const textFile = __dirname + '/image_to_text.csv';
const fileIdentifiers = __dirname + '/file_identifiers.csv';

const hasImage = (str) => {
    return /.*\.jpg/.test(str);
};

const limitCount = (el, idx) => {
    return idx <= 200000;
};

const cleanRow = (str) => {
    const newRow = {};
    const matches = str[0].match(/.*\.jpg/);
    newRow.filename = matches[0];
    newRow.text = '';
    const text = str[0].replace(newRow.filename, '');

    const p = buildHtmlParser(newRow);
    p.write(text);
    p.end();
    return newRow;
};

const vacuumText = (cb) => {
    fs.readFile(textFile, (err, data) => {
        csvParser(data, { delimiter: '\t', relax: true }, (csvErr, csvObj) => {
            const vacuumed = csvObj.filter(hasImage).filter(limitCount).map(cleanRow);
            cb(vacuumed);
        });
    });
};

const vacuumIds = (cb) => {
    fs.readFile(fileIdentifiers, (err, data) => {
        csvParser(data, { delimiter: '\t', relax: true }, (csvErr2, csvObjId) => {
            const vacuumed = csvObjId.filter(limitCount).map((arr, i) => ({ filename: arr[1], eid: arr[0] }));
            cb(vacuumed);
        });
    });
};

const mergeData = (textData, idData) => {
    const reduced = textData.reduce((merged, t) => {
        if (t && t.filename) {
            merged[t.filename] = t;
        }
        return merged;
    }, {});

    idData.reduce((merged, t) => {
        if (merged[t.filename]) {
            merged[t.filename].eid = t.eid;
        } else {
            delete merged[t.filename];
        }
        return merged;
    }, reduced);
    return reduced;
};

vacuumText((textData) => {
    vacuumIds((idData) => {
        const merged = mergeData(textData, idData);

        const done = Object.keys(merged).reduce((list, key) => {
            if (merged[key].eid) {
                list.push(merged[key]);
            }
            return list;
        }, []);
        console.log(done);
    });
})
