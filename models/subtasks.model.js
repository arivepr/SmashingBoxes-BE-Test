const mongoose = require('mongoose');

const subtaskSchema = mongoose.Schema({
    title: String,
    description: String,
    status:{
        type: Boolean,
        default: false
    },
    completed_at: {
        type: Date,
        default: null
    },
    parent_task: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Subtask = new mongoose.model('Subtask', subtaskSchema);

exports.Subtask = Subtask; 