const mongoose = require('mongoose');

const SubtaskSchema = mongoose.Schema({
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
        ref:"Task",
        required: true
    }
});

const Subtask = new mongoose.model('Subtask', SubtaskSchema);

exports.Subtask = Subtask; 