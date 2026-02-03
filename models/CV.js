const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, 
    aboutMe: { type: String }, 
    education: 
    [ 
        { 
            degree: { type: String }, 
            institution: { type: String }, 
            fieldOfStudy: { type: String }, 
            startDate: { type: Date }, 
            endDate: { type: Date }, 
        } 
    ], 
    experience: 
    [ 
        { 
            position: { type: String, uppercase: true }, 
            company: { type: String, uppercase: true }, 
            startDate: { type: Date }, endDate: { type: Date }, 
            isCurrent: { type: Boolean, default: false }, 
            description: { type: String } 
        } 
    ], 
    skills: [{ type: String }], 
    githubUsername: { type: String }, 
    socials: 
    { 
        youtube: { type: String }, 
        x: { type: String }, 
        facebook: { type: String }, 
        linkedin: { type: String }, 
    }, 
    visibility: 
    {
        aboutMe: { type: Boolean, default: false },
        socials: { type: Boolean, default: false },
        education: { type: Boolean, default: false },
        experience: { type: Boolean, default: false },
        skills: { type: Boolean, default: false },
        githubUsername: { type: Boolean, default: false }
    }
}, { timestamps: true }); 

const CV = mongoose.model('CV', CVSchema);

module.exports = CV;