const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type:Boolean, 
        default:false
    },
    completed_at: {
        type: Date, 
        default:null
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'List',
        default: '112233445566778899000102' // Referencing back to default user task list
        /* 
            NOTES ON THIS APPROACH: Admittedly a rather hackathon-ish move, but serves the purpose of this test perfectly,
            as we're referencing to a default user-list, if the task is not being added through a list initially. With more
            time this could have been cleaned up with a bootstrap method that could create a unique id for the default list,
            and populate it here, instead of a hardcoded one on both places. Could also eliminate the ability to post a task
            directly through this end-point altogether, and only through  a list. Much options, such little time.   
        */
    }

});

const Task = new mongoose.model('Task', tasksSchema);


exports.Tasks = Task;


