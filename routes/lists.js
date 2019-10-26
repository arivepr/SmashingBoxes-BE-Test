const express = require('express');
const {List} = require('../models/lists.model');
const {Tasks} = require('../models/tasks.model');
const router =  express.Router();

router.use(express.json());

router.post('/', async (req, res) => {
    let {title: listTitle} = req.body;


    let list = new List({
        title: listTitle
    });

    let result = await list.save();
    res.send(result);

});

router.get('/', async(req, res) => {
    let lists = await List.find();

    for (let list of lists){
        let tasks = await Tasks.find({list: list._id});

        // Due to time constraints, we're not saving/populating the list documents with their tasks
        // For the requirements of this test i found it enough to set as a response, as it could still be
        // used for a UI, as it is part of the response object.
        list.tasks.push(...tasks);

    }

    res.send(lists);    
});

router.get('/:id', async(req, res) => {
    const {id} = req.params;

    let list = await List.findById(id);
    let tasks = await Tasks.find({list: id});

    list.tasks.push(...tasks);
    
    res.send(list);
    
});

router.put('/:id/toggle_completion', async(req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    let list = await List.findById(id);
    let tasks = await Tasks.find({list: id});

    list.status = status;
    status ? list.completed_at = Date.now() : null; // If our list is complete, give it a timestamp, otherwise it's nullified
    list = await list.save(); // We save the list before pushing the tasks to avoid saving child references to the parent document

    for(let task of tasks){
        task.status = status;
        status ? task.completed_at = Date.now() : null; // If our task is complete, timestamp it, otherwise nullify it. 
        task = await task.save(); // We save the data of each individual task
        list.tasks.push(task);
    }

    res.send(list);
});

router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    console.log('Receiving request to delete: \n', id);

    let result = await Tasks.findByIdAndDelete({
        _id: id
    });

    let tasks = await Tasks.deleteMany({list:id});
    console.log(`Deleting tasks insid of list ${id}\n`, tasks);

    let completeDelete = {
        list: result,
        tasks: tasks
    }
    res.send(completeDelete);

});

module.exports = router;