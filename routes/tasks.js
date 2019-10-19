const express = require('express');
const router = express.Router();

const tasks = [
	{title:'Test', description:'This is a pointless object for a list'}
]
router.use(express.json());

router.post('/', (req, res) => {
	console.log('Receiving post message req', req);
	const task = {
		id: tasks.length + 1,
		title: req.body.title,
		description: req.body.description
	}

	tasks.push(task);
	res.send(task);
})

router.get('/:id', (req, res) => {
	console.log('Retrieving the user with id: ', req.body.id);
	
})

module.exports = router;