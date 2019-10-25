const express = require('express');
const {Tasks} = require('../models/tasks.model');
const router = express.Router();

router.use(express.json());


router.get('/', async (req, res) => {
	let tasks = await Tasks.find().populate('list');

	res.send(tasks);
});


router.get('/:id', async (req, res) => {
	console.log('Retrieving the user with id: ', req.body.id);
	let task = await Tasks.findById(req.params.id);
	
	res.send(task);
});

router.post('/', async (req, res) => {
	let {title, description} = req.body;

	let task = new Tasks({
		title: title,
		description: description
	});

	let result = await task.save().then(result => {
		console.log(result);
	})
	// let proce

	res.send(result);
});

// Post with required list behavior //
router.post('/', async (req, res) => {
	let {title, description} = req.body;

	let task = new Tasks({
		title: title,
		description: description
	});

	let result = await task.save();

	console.log('This is our result from posting: ', result);
});

router.delete('/:id', async (req, res) => {
	
	let {id} = req.params;
	console.log("Receiving request to delete: ", id);

	let result = await Tasks.findByIdAndDelete({_id: id});

	console.log(result);
	res.send(result);
});

router.put('/:id/toggle_completion', async (req, res) => {
	let {status} = req.body; // We could also consider the call itself triggering status: !currentStatus as an alternative to this logic
	let {id} = req.params;
	
	// If the task is being cancelled and the user is editing it, nullify the previous completed_at value
	if(status){
		let task = await Tasks.findByIdAndUpdate(
			{_id: id}, 
			{$set: {status: status, completed_at:Date.now()}},
			{new: true}
		);
		res.send(task);
	}
	else {
		let task = await Tasks.findByIdAndUpdate(
			{_id: id}, 
			{$set: {status: status, completed_at:""}}, 
			{new: true}
		);
		res.send(task);
	}
});


module.exports = router;