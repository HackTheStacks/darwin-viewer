const express = require('express');
const router = express.Router();
const path = require('path');
const models = require('../models');

const Fragment = models.Fragment;
const Match = models.Match;

const imgBase = path.join(__dirname, '..', 'data', 'images');

router.get('/fragments', (req, res) => {
    Fragment.findAll().then((fragments) => {
        res.json(fragments);
    });
});

router.get('/fragments/:id/image', (req, res) => {
    Fragment.find({ where: { id: req.params.id } }).then((fragment) => {
        const imagePath = path.resolve(path.join(imgBase, fragment.filename));
        res.sendFile(imagePath);
    });
});

router.get('/fragments/:id', (req, res) => {
    Fragment
        .find({
            where: { id: req.params.id },
        })
        .then((fragment) => {
            Match.findAll({
                where: {
                    $or: [
                        { baseId: fragment.id },
                        { targetId: fragment.id },
                    ],
                },
            }).then((matches) => {
                const fragObj = fragment.toJSON();
                fragObj.matches = matches.map(m => m.toJSON());
                res.json(fragObj);
            });
        }).catch((err) => {
            res.json(err.stack);
        });
});

// route.post('/fragments/:id/')

module.exports = router;
