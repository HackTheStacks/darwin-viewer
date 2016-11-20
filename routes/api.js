const express = require('express');
const router = express.Router();
const path = require('path');

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
	res.json(mockFragments);
});

const mockImage = path.resolve(path.join(__dirname, '..', 'data', 'images', 'paper.png'));

router.get('/fragments/:id/image', (req, res) => {
	res.sendFile(mockImage);
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
	res.json(mockFragment);
});

module.exports = router;
