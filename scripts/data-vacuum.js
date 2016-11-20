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
const neighboursJson = __dirname + '/friends.json';

const hasImage = (str) => {
    return /.*\.jpg/.test(str);
};

const limitCount = (el, idx) => {
    return idx <= 300000;
};

const cleanRow = (str) => {
    const newRow = {};
    const matches = str[0].match(/.*\.jpg/);
    newRow.filename = matches[0];
    newRow.text = '';
    const text = str[0].replace(newRow.filename, '').replace(',b\'', '');

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

const vacuumNeighbours = (cb) => {
    fs.readFile(neighboursJson, (err, data) => {
        const json = JSON.parse(data);
        const reduced = json.reduce((merged, n) => {
            const baseId = n[0];
            const neigbours = n[1];

            const eid = baseId.match(/\d+/)[0];
            const neighbourObjs = neigbours.map((n) => {
                const neid = n.match(/\d+/)[0];
                const edge = n.match(/\_(\w)\w*\.csv/)[1].toUpperCase();
                return { targetId: neid, edge };
            });

            merged[eid] = neighbourObjs;

            return merged;
        }, {});
        cb(reduced);
    });
};

const mergeData = (textData, idData) => {
    const reduced = textData.reduce((merged, t) => {
        merged[t.filename] = t;
        return merged;
    }, {});

    idData.reduce((merged, t) => {
        if (merged[t.filename]) {
            merged[t.filename].eid = t.eid;
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
        done.sort((el1, el2) => el1.filename > el2.filename);
        fs.writeFileSync(__dirname + '/../data/aggregated.json', JSON.stringify(done, null, 4));
    });
});
