const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type:Boolean, default:false},
    completed_at: Date,

});

const Task = new mongoose.model('Task', tasksSchema);

exports.Tasks = Task;

