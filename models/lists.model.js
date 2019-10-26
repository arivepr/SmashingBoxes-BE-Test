const mongoose = require('mongoose');
const {Task} = require('../models/tasks.model');


const ListSchema = mongoose.Schema({
    title: String,
    status: {
        type: Boolean, 
        default: false
    },
    completed_at: {
        type: Date, 
        default:null
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
});


const List = new mongoose.model('List', ListSchema);

// In order to deal with newly created tasks, we will fill the user's collections with a default list document
async function _initiateDefaultList() {
    // We first verify that the list is not already present in the collection
    console.log("Verifying");


    let result = await List.findOne({
        title: "User's Task List"
    })

    if(result == null){ // If the default task list is not present, we insert it into the collection
        const defaultList = new List({
            _id: '112233445566778899000102',
            title: "User's Task List"
        });

        let list =  await defaultList.save();
        console.log('User default list has been initiated', list);
    }else{
        console.log('Document already initialized.');
    }
};

_initiateDefaultList();
exports.List = List;


