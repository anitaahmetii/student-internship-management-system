const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    maxPoints: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;