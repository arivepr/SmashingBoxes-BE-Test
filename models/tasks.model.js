const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: Boolean,
    completed_at: Date,

});

// We then need to export all of the methods that will be part of the tasks model