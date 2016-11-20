const express = require('express');
const router = express.Router();
const path = require('path');
const models = require('../models');

const Fragment = models.Fragment;
const Match = models.Match;

const imgBase = path.join(__dirname, '..', 'data', 'images');

router.get('/fragments', (req, res) => {
    Fragment.findAll({
        include: [{ model: Match, as: 'matches' }],
    }).then((fragments) => {
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
            include: [{ model: Match, as: 'matches' }],
            where: { id: req.params.id },
        })
        .then((fragment) => {
            res.json(fragment);
        }).catch((err) => {
            res.json(err.stack);
        });
});

router.post('/matches', (req, res) => {
    const { baseId, targetId, confidence, votes, edge } = req.body;
    console.log(req.body);
    Match.create({ baseId, targetId, confidence, votes, edge }).then((newMatch) => {
        res.json(newMatch);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.put('/matches/:id/upvote', (req, res) => {
    Match.find({ where: { id: req.params.id } }).then((match) => {
        match.update({ votes: match.votes + 1}).then((updatedMatch) => {
            res.json(updatedMatch);
        });
    });
});

router.put('/matches/:id/downvote', (req, res) => {
    Match.find({ where: { id: req.params.id } }).then((match) => {
        match.update({ votes: match.votes - 1}).then((updatedMatch) => {
            res.json(updatedMatch);
        });
    });
});

module.exports = router;
