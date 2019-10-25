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