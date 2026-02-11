require('dotenv').config();
const InternshipApplication = require('../models/InternshipApplication');
const jwt = require('jsonwebtoken');
const internshipService = require('./internship.service');

const register = async (studentToken, internshipId) =>
{
    try
    {
        const student = jwt.verify(studentToken, process.env.ACCESS_TOKEN_SECRET);
        const { _id: studentId } = student;

        const { exists: internshipAvailable } = await internshipService.getById(internshipId);
        if (!internshipAvailable) throw new Error("Internship not found!");

        const exists = await hasStudentApplied(studentId, internshipId);
        if (exists) throw new Error("You already applied for this internship!");

        const internshipApplication = new InternshipApplication({ student: studentId, internship: internshipId });
        const savedInternship = await internshipApplication.save();

        const appliedInternship = await getAppliedInternship(savedInternship._id);
        return appliedInternship;
    }
    catch(err)
    {
        if (err.name === 'TokenExpiredError') 
        {
            throw new Error("Please, login!");
        } 
        else 
        {
            throw new Error(`Database error while processing internship application: ${err.message}`);
        }
    }
}
const getAppliedInternship = async (appliedInternshipId) =>
{
    const application = await InternshipApplication.findById({ _id: appliedInternshipId })
                                                   .select('-feedback -reviewedBy -reviewedAt -isVisible -createdAt -updatedAt -__v')
                                                   .populate({ path: 'student', select: 'email -_id'})
                                                   .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                populate: 
                                                                [
                                                                    { path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }
                                                                ]})
                                                   .lean();
    if (!application) throw new Error("No applied internship found!");
    return application;
}
const hasStudentApplied = async (studentId, internshipId) =>
{
    const exists = await InternshipApplication.findOne({ student: studentId, internship: internshipId })
    return !!exists;
}

module.exports = 
{
    register
}