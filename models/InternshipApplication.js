const mongoose = require('mongoose');

const InternshipApplicationSchema = new mongoose.Schema({ 
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true }, 
    appliedAt: { type: Date, default: Date.now }, 
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, 
    feedback: { type: String }, 
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    reviewedAt: { type: Date }, 
    isVisible: { type: Boolean, default: false } 
}, { timestamps: true });

const InternshipApplication = mongoose.model('InternshipApplication', InternshipApplicationSchema);

module.exports = InternshipApplication;