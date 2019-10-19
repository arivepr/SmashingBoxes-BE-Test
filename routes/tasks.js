const express = require('express');
const {Tasks} = require('../models/tasks.model');
const router = express.Router();

// const tasks = [
// 	{title:'Test', description:'This is a pointless object for a list'}
// ]
router.use(express.json());


router.get('/', async (req, res) => {
	let tasks = await Tasks.find();

	res.send(tasks);
});


router.get('/:id', async (req, res) => {
	console.log('Retrieving the user with id: ', req.body.id);
	let task = await Tasks.findById(req.params.id);
	
	res.send(task);
});

router.post('/', async (req, res) => {
	console.log('Receiving post message req', req);
	let task = new Tasks({
		title: req.body.title,
		description: req.body.description
	});

	let result = await task.save()
	res.send(result);
});

router.delete('/:id', async (req, res) => {
	
	let {id} = req.params;
	console.log("Receiving request to delete: ", id);

	let result = await Tasks.findByIdAndDelete({_id: id});

	console.log(result);
	res.send(result);
});


module.exports = router;