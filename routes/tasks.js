const express = require('express');
const {Tasks} = require('../models/tasks.model');
const {Subtask} = require('../models/subtasks.model');
const router = express.Router();

router.use(express.json());


router.get('/', async (req, res) => {
	
	try {
		let tasks = await Tasks.find().populate('list');
		for(task of tasks){
			let {_id} = task;
			let subtasks = await Subtask.find({parent_task: _id});
			
			task.subtasks.push(...subtasks);
		}
		res.send(tasks)
	} catch (error) {
		res.send(error);
	}

});


router.get('/:id', async (req, res) => {
	console.log('Retrieving the user with id: ', req.body.id);
	let task = await Tasks.findById(req.params.id);
	
	res.send(task);
});


router.post('/', async (req, res) => {
	let {title, description, list} = req.body;

	let task = new Tasks({
		title,
		description,
		list
	});

	let result = await task.save();

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
	const {id} = req.params;
	console.log("Receiving request to delete: ", id);

	let result = await Tasks.findByIdAndDelete({_id: id});

	console.log(result);
	res.send(result);
});


router.put('/:id/toggle_completion', async (req, res) => {
	const {status} = req.body; // We could also consider the call itself triggering status: !currentStatus as an alternative to this logic
	const {id} = req.params;
	
	try {
		// If the task is being cancelled and the user is editing it, nullify the previous completed_at value
		let task = await Tasks.findById(id);
		let subtasks = await Subtask.find({
			parent_task: id
		});

		task.status = status;
		task.completed_at = status ? Date.now() : null;

		for (let subtask of subtasks) {
			subtask.status = status;
			subtask.completed_at = status ? Date.now() : null;
			subtask.save();
		}

		let completedQuery = {
			task,
			subtasks
		}

		res.send(completedQuery);
	} catch (error) {
		res.send(error);
	}
	
});


module.exports = router;