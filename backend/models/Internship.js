const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({ 
    position: { type: String, required: true }, 
    companyName: { type: String, required: true, uppercase: true }, 
    preRequirements: { type: [String], required: true }, 
    responsibilities: { type: [String], required: true }, 
    applicationDeadline: { type: Date, required: true }, 
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }, 
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    isVisible: { type: Boolean, default: false } 
}, { timestamps: true });

const Internship = mongoose.model('Internship', InternshipSchema);

module.exports = Internship;