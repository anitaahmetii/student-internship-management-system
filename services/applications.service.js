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
const getAll = async () => 
{
    const applications = await InternshipApplication.find({})
                                                    .populate({ path: 'student', select: 'email -_id'})
                                                    .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                populate: 
                                                                [
                                                                    { path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }]})
                                                   .lean();
    if (applications.length === 0) throw new Error("No internship applications found!");
    return applications;
}
const toUpdate = async (applicationId, hrToken, status, feedback, isVisible) => 
{
    try 
    {
        const hrUser = jwt.verify(hrToken, process.env.ACCESS_TOKEN_SECRET);
        const { _id: hrUserId } = hrUser;

        const { exists: applicationAvailable, internshipId } = await findById(applicationId);
        if (!applicationAvailable) throw new Error("Internship application not found!");

        const { hr } = await internshipService.getById(internshipId);

        if(hrUserId.toString() !== hr.toString()) throw new Error("Access denied to review this application!");

        const updateApplication = await InternshipApplication.findByIdAndUpdate({ _id: applicationId },
                                                                                { status, 
                                                                                  feedback,
                                                                                  reviewedBy: hrUserId,
                                                                                  isVisible },
                                                                                { new: true, runValidators: true });
        return updateApplication;                                                                               
    }
    catch(err)
    {
        throw new Error(`Database error while updating internship application: ${err.message}`);
    }
}
const findById = async (applicationId) =>
{
    const exists = await InternshipApplication.findById({ _id: applicationId });
    return { exists: !!exists, internshipId: exists?.internship };
}
module.exports = 
{
    register,
    getAll,
    toUpdate
}