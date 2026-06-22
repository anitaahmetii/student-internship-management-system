const mongoose = require('mongoose');

 const ProgressTrackerSchema = new mongoose.Schema({ 
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipEnrollment', required: true }, 
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, 
    feedback: { type: String }, 
    pointsEarned: { type: Number, default: 0 },
    assignedAt: { type: Date, default: Date.now }, 
    completedAt: { type: Date }, 
    status: { type: String, enum: ['pending', 'done'], default: 'pending' }, 
    isVisible: { type: Boolean, default: false } 
}, { timestamps: true }); 

ProgressTrackerSchema.index({ enrollment: 1, task: 1 }, { unique: true });

const ProgressTracker = mongoose.model('ProgressTracker', ProgressTrackerSchema);
ProgressTrackerSchema.pre('save', function(next) {
    if (this.status === 'done' && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

module.exports = ProgressTracker;