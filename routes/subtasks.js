const express = require('express');
const router = express.Router();
const {Subtask} = require('../models/subtasks.model');
const {Tasks} = require('../models/tasks.model');

router.use(express.json());


router.get('/', async (req, res) => {
    const subtasks = await Subtask.find().populate('parent_task', 'title description _id');
    console.log('My current instance: ', subtasks);
    res.send(subtasks);
});


router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const subtask = await Subtask.findById(id);

    res.send(subtask);
});


router.put('/:id/toggle_completion', async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    let subtask = await Subtask.findById(id)
        .populate('parent_task', ('title description _id'));
        
    subtask.status = status;
    subtask.completed_at = status ? Date.now() : null;

    let result = await subtask.save();
    res.send(result);
});


router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    console.log('Receiving request to delete: \n', id);
    
    let result = await Subtask.findByIdAndDelete({_id:id});
    res.send(result);
});


router.post('/', async (req, res) => {
    const {title, description, parent_task} = req.body;

    let subtask = new Subtask({
        title, 
        description, 
        parent_task
    });
    
    try {
        let result = await subtask.save();
        res.send(result);
    } catch (error) {
        res.send(error);
    }
    
});


module.exports = router;