const express = require('express');
const {List} = require('../models/lists.model');
const {Tasks} = require('../models/tasks.model');
const {Subtask} = require('../models/subtasks.model');

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
    let incomplete_count = 0;

    for (let list of lists){
        let tasks = await Tasks.find({list: list._id});
        
        for(let task of tasks){
            let {_id} = task;
            console.log("This is our task" , task);
            incomplete_count += task.status ? 0 : 1; // If its completed, don't sum anything

            let subtasks = await Subtask.find({parent_task: _id});

            for(let subtask of subtasks){
                incomplete_count += subtask.status ? 0 : 1;
            }

            task.subtasks.push(...subtasks);
        }
        

        // Due to time constraints, we're not saving/populating the list documents with their tasks
        // For the requirements of this test i found it enough to set as a response, as it could still be
        // used for a UI, as it is part of the response object.
        list.tasks.push(...tasks);

    }

    let completedQuery = {
        lists,
        incomplete_count
    }

    res.send(completedQuery);    
});


router.get('/:id', async(req, res) => {
    const {id} = req.params;

    let list = await List.findById(id);
    let tasks = await Tasks.find({list: id});

    for(let task of tasks){
            let {_id} = task;
            let subtasks = await Subtask.find({parent_task: _id});
            task.subtasks.push(...subtasks);
        }
        
    list.tasks.push(...tasks);
    
    res.send(list);
    
});


router.put('/:id/toggle_completion', async(req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    try {
        let list = await List.findById(id);
        let tasks = await Tasks.find({list: id});

        list.status = status;
        list.completed_at = status ? Date.now() : null; // If our list is complete, give it a timestamp, otherwise it's nullified
        list = await list.save(); // We save the list before pushing the tasks to avoid saving child references to the parent document

        for (let task of tasks) {
            let {_id} = task;
            let subtasks = await Subtask.find({parent_task: _id});

            task.status = status;
            task.completed_at = status ? Date.now() : null; // If our task is complete, timestamp it, otherwise nullify it. 
            task = await task.save(); // We save the data of each individual task
            list.tasks.push(task);

            for (let subtask of subtasks) {
                subtask.status = status;
                subtask.completed_at = status ? Date.now() : null;
                subtask = await subtask.save();
                task.subtasks.push(subtask);
            }
        }

        res.send(list);

    } catch (error) {
        res.send(error);
    }

    
});


router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    let subtasks ={}; // empty object for now
    console.log('Receiving request to delete: \n', id);

    try {
        let list = await List.findByIdAndDelete({ // We find the top-most doc
            _id: id
        });

        let tasks = await Tasks.deleteMany({ // Find the tasks it contains
            list: id
        });

        for (let task of tasks) { // Iterate over the tasks, and delete all of their individual subtasks
            let {
                _id
            } = task
            subtasks = await Subtask.deleteMany({
                parent_task: _id
            });
        }

        console.log(`Deleting tasks inside of list ${id}\n`, tasks);

        let completeDelete = { // Send the full deleted object back to the user
            list,
            tasks,
            subtasks
        }

        res.send(completeDelete);
    } catch (error) {
        res.send(error);
    }
});

// async function countIncompleteTasks() {

// }

module.exports = router;