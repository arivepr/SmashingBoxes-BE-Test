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
	let {title, description} = req.body;

	let task = new Tasks({
		title: title,
		description: description
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

router.put('/:id/toggle_completion', async (req, res) => {
	let {status} = req.body; // We could also consider the call itself triggering status: !currentStatus as an alternative to this logic
	let {id} = req.params;
	
	// If the task is being cancelled and the user is editing it, nullify the previous completed_at value
	if(status){
		let task = await Tasks.findByIdAndUpdate({_id: id}, {$set: {status: status, completed_at:Date.now()}}, {new: true});
		res.send(task);
	}
	else {
		let task = await Tasks.findByIdAndUpdate({_id: id}, {$set: {status: status, completed_at:""}}, {new: true});
		res.send(task);
	}
});



module.exports = router;