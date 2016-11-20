const express = require('express');
const router = express.Router();
const path = require('path');
const models = require('../models');

const Fragment = models.Fragment;
const Match = models.Match;

const mockFragments = [
	{
		id: '1',
		url: '/api/fragments/1/image',
	},
	{
		id: '2',
		url: '/api/fragments/2/image',
	},
	{
		id: '3',
		url: '/api/fragments/3/image',
	},
];

router.get('/fragments', (req, res) => {
    Fragment.findAll().then((fragments) => {
        res.json(fragments);
    });
});

const imgBase = path.join(__dirname, '..', 'data', 'images');

router.get('/fragments/:id/image', (req, res) => {
    Fragment.find({ where: { id: req.params.id } }).then((fragment) => {
        const imagePath = path.resolve(path.join(imgBase, fragment.filename));
        res.sendFile(imagePath);
    });
});

const mockFragment = {
	id: '1',
	url: '/api/fragments/1/image',
	text: 'I\'m Darwin! Look at me! :D',
	matches: [
		{
			id: '2',
			edge: 'S',
			confidence: '90',
			votes: 3,
		},
		{
			id: '3',
			edge: 'W',
			confidence: '70',
			votes: 1,
		},
	],
};

router.get('/fragments/:id', (req, res) => {
    Fragment
        .find({ include: [{ model: Match, as: 'matches' }], where: { id: req.params.id } })
        .then((fragment) => {
            res.json(fragment);
        }).catch((err) => {
            res.json(err.stack);
        });
});

module.exports = router;
