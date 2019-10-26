const express = require('express');
const router = express.Router();
const {Subtask} = require('../models/subtasks.model');
const {Tasks} = require('../models/tasks.model');

router.use(express.json());


router.get('/', async (req, res) => {
    const subtasks = await Subtask.find();

    res.send();
});


router.post('/', async (req, res) => {
    const {title, description, parent_task} = req.body;

    let subtask = new Subtask({
        title, 
        description, 
        parent_task
    });

    let result = await subtask.save();
    res.send(result);
});


module.exports = router;