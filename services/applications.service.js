require('dotenv').config();
const InternshipApplication = require('../models/InternshipApplication');
const jwt = require('jsonwebtoken');
const internshipService = require('./internship.service');
const Internship = require('../models/Internship');

const register = async (studentId, internshipId, file) =>
{
    try
    {
        const { exists: internshipAvailable } = await internshipService.getById(internshipId);
        if (!internshipAvailable) throw new Error("Internship not found!");

        const exists = await hasStudentApplied(studentId, internshipId);
        if (exists) throw new Error("You already applied for this internship!");

        const internshipApplication = new InternshipApplication({ student: studentId, internship: internshipId, 
                                                                  cv: { fileUrl: `/uploads/${file.filename}`, fileName: file.originalname }});
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
const toUpdate = async (applicationId, userId, status, feedback, isVisible) => 
{
    try 
    {

        const { exists: applicationAvailable, internshipId } = await findById(applicationId);
        if (!applicationAvailable) throw new Error("Internship application not found!");

        const uploadedInternship = await Internship.findOne({ _id: internshipId, uploadedBy: userId });
        if (!uploadedInternship) throw new Error("You have not uploaded this internship!");


        const updateApplication = await InternshipApplication.findByIdAndUpdate({ _id: applicationId },
                                                                                { status, 
                                                                                  feedback,
                                                                                  reviewedBy: userId,
                                                                                  isVisible },
                                                                                { new: true, runValidators: true });
        return updateApplication;                                                                               
    }
    catch(err)
    {
        throw new Error(`Database error while updating internship application: ${err.message}`);
    }
}
const toDelete = async (applicationId, userId) =>
{
    try
    {
        
        const { exists: applicationAvailable, internshipId } = await findById(applicationId);
        if (!applicationAvailable) throw new Error("Internship application not found!");

        const uploadedInternship = await Internship.findOne({ _id: internshipId, uploadedBy: userId });
        if (!uploadedInternship) throw new Error("You have not uploaded this internship!");

        const deleteApplication = await InternshipApplication.findByIdAndDelete({ _id: applicationId });
        return deleteApplication;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting internship application: ${err.message}`);
    }
}
const myApplicationsAsStudent = async (studentId) =>
{
    try
    {
        const applications = await InternshipApplication.find({ student: studentId })
                                                        .select('-isVisible -createdAt -updatedAt -__v')
                                                        .populate({ path: 'student', select: 'email -_id'})
                                                        .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                    populate: 
                                                                    [
                                                                        { path: 'location', select: 'name -_id' },
                                                                        { path: 'uploadedBy', select: 'email -_id' },
                                                                        { path: 'updatedBy', select: 'email -_id' }
                                                                    ]})
                                                        .lean();
        if (applications.length === 0) throw new Error("You haven't applied to any internship yet!");
        return applications;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving internship applications as student: ${err.message}`)
    }
}
const myApplicationsAsHr = async (hrId) =>
{
    try
    {
        const reviews = await InternshipApplication.find({ reviewedBy: hrId })
                                                    .select('-isVisible -createdAt -__v')
                                                    .populate({ path: 'student', select: 'email -_id'})
                                                    .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                populate: 
                                                                [
                                                                    { path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }
                                                                ]})
                                                    .populate({ path: 'reviewedBy', select: 'email -_id'})
                                                    .lean();
        if (reviews.length === 0) throw new Error("You haven't reviewed any internship yet!");
        return reviews;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving internship applications reviewed as hr: ${err.message}`)
    }
}
const findById = async (applicationId) =>
{
    const exists = await InternshipApplication.findById({ _id: applicationId });
    return { exists: !!exists, internshipId: exists?.internship };
}
const searchByStatus = async (hrId, status) =>
{
    try
    {
        const applications = await InternshipApplication.find({ reviewedBy: hrId, status: status });
        if (applications.length === 0) throw new Error(`No application found with ${status} status!`);
        return applications;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving internship applications based on status: ${err.message}`)
    }
}
const acceptedStudents = async (hrId, internshipId) => 
{
    try
    {
        const internshipPosition = await internshipService.getPositionById(internshipId);

        const applications = await InternshipApplication.find({ reviewedBy: hrId, status: 'accepted', internship: internshipId })
                                                        .populate({ path: 'student', select: 'email _id'})
                                                        .lean();
        if (applications.length === 0) throw new Error(`No accepted students found!`);

        return {
                    internship: internshipPosition,
                    students: applications.map(s => ({
                        _id: s.student._id,
                        email: s.student.email
                    }))
                };
    }
    catch(err)
    {
        throw new Error(`Failed to fetch accepted students: ${err.message}`)
    }
}
module.exports = 
{
    register,
    getAll,
    toUpdate,
    toDelete,
    myApplicationsAsStudent,
    myApplicationsAsHr,
    searchByStatus,
    acceptedStudents
}