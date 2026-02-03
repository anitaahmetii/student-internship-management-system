const mongoose = require('mongoose');

 const ProgressTrackerSchema = new mongoose.Schema({ 
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipEnrollment', required: true }, 
    task: { type: String, required: true }, 
    feedback: { type: String }, 
    points: { type: Number, required: true }, 
    assignedAt: { type: Date, default: Date.now }, 
    completedAt: { type: Date }, 
    status: { type: String, enum: ['pending', 'done'], default: 'pending' }, 
    isVisible: { type: Boolean, default: false } 
}, { timestamps: true }); 

const ProgressTracker = mongoose.model('ProgressTracker', ProgressTrackerSchema);

module.exports = ProgressTracker;