const mongoose = require('mongoose');

const InternshipEnrollmentSchema = new mongoose.Schema({ 
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true }, 
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    isVisible: { type: Boolean, default: false } 
}, { timestamps: true });

InternshipEnrollmentSchema.index({ internship: 1, student: 1 }, { unique: true });

const InternshipEnrollment = mongoose.model('InternshipEnrollment', InternshipEnrollmentSchema);

module.exports = InternshipEnrollment;