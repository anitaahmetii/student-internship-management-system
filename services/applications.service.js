require('dotenv').config();
const InternshipApplication = require('../models/InternshipApplication');
const jwt = require('jsonwebtoken');
const internshipService = require('./internship.service');
const Internship = require('../models/Internship');
const fs = require('fs');
const path = require('path');
const userService = require('./user.service');

const register = async (studentId, internshipId, file) =>
{
    try
    {
        const internshipAvailable = await internshipService.getById(internshipId);
        if (!internshipAvailable.exists) throw new Error("Internship not found!");

        const now = new Date();
        if (now > internshipAvailable.deadline) throw new Error("Application deadline has passed!");

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
        throw new Error(`Database error while processing internship application: ${err.message}`);
    }
}
const updateMyCV = async (studentId, internshipId, file) =>
{
    try
    {
        const internshipAvailable = await internshipService.getById(internshipId);
        if (!internshipAvailable.exists) throw new Error("Internship not found!");

        const now = new Date();
        if (now > internshipAvailable.deadline) throw new Error("Application deadline has passed!");
        
        const oldApplication = await InternshipApplication.findOne({ student: studentId, internship: internshipId }).select('cv');;
        if (!oldApplication) throw new Error("Application not found!");

        const updatedCV = await InternshipApplication.findOneAndUpdate({ student: studentId, internship: internshipId }, 
                                                                        { cv: { fileUrl: `/uploads/${file.filename}`, fileName: file.originalname }}, 
                                                                        { new: true, runValidators: true});
        
        if (oldApplication.cv.fileUrl) 
        {
            const oldPath = path.join(__dirname, '../public', oldApplication.cv.fileUrl);
            fs.unlink(oldPath, () => {});
        }
        return updatedCV;
    }
    catch(err)
    {
        throw new Error(`Failed to update CV: ${err.message}`)
    }
}
const getAllApplicants = async (hrId, internshipId) => 
{
    try
    {
        const internshipData = await internshipService.getById(internshipId);
        if (!internshipData.exists) throw new Error ("Internship not found!");
        if (!internshipData.hr.equals(hrId)) throw new Error ("Internship not available!");

        const applications = await InternshipApplication.find({ internship: internshipId })
                                                        .select('-isVisible -createdAt -updatedAt -__v')
                                                        .populate({ path: 'student', select: 'email -_id'})
                                                        .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                    populate: 
                                                                    [{ path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }]})
                                                        .lean();
        if (applications.length === 0) throw new Error("No applicants found for this internship!");

        const formatted = applications.map(({ student, cv, ...rest }) => ({ student,
                                                                            cvUrl: cv?.fileUrl ? `http://localhost:3000${cv.fileUrl}` : null,
                                                                            ...rest }));
        return formatted;
    }
    catch (err)
    {
        throw new Error(`Failed to retrieve applicants: ${err.message}`)
    }
}
const getStudentCV = async (hrId, internshipId, studentEmail) =>
{
    try
    {
        const internshipData = await internshipService.getById(internshipId);
        if (!internshipData.exists) throw new Error ("Internship not found!");
        if (!internshipData.hr.equals(hrId)) throw new Error ("Internship not available!");

        const studentId = await userService.checkEmail(studentEmail);
        if (!studentId.exists) throw new Error("Student not found!");

        const application = await InternshipApplication.findOne({ internship: internshipId, student: studentId.userId })
                                                       .select('cv');
        if (!application) throw new Error("Application not found!");
        if (!application?.cv?.fileUrl) throw new Error("CV not found!");

        return `http://localhost:3000${application.cv.fileUrl}`; 
    }
    catch (err)
    {
        throw new Error(`Failed to retrieve student CV: ${err.message}`)
    }
}
const toUpdate = async (hrId, applicationId, status, feedback, isVisible) => 
{
    try 
    {
        const application = await InternshipApplication.findById(applicationId).select('internship');
        if (!application) throw new Error("Application not found!");

        const internshipData = await internshipService.getById(application.internship);
        if (!internshipData.hr.equals(hrId)) throw new Error ("Application not available!");

        const updateApplication = await InternshipApplication.findByIdAndUpdate(applicationId,
                                                                                { status, 
                                                                                  feedback,
                                                                                  reviewedBy: hrId,
                                                                                  reviewedAt: new Date(),
                                                                                  isVisible },
                                                                                { new: true, runValidators: true });
        return updateApplication;                                                                               
    }
    catch(err)
    {
        throw new Error(`Database error while updating internship application: ${err.message}`);
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

        const formatted = applications.map(({ student, cv, ...rest }) => ({ student,
                                                                            cvUrl: cv?.fileUrl ? `http://localhost:3000${cv.fileUrl}` : null,
                                                                            ...rest }));
        return formatted;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving internship applications as student: ${err.message}`)
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
const getAll = async () => 
{
    const applications = await InternshipApplication.find({})
                                                    .select('-isVisible -createdAt -updatedAt -__v')
                                                    .populate({ path: 'student', select: 'email -_id'})
                                                    .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                populate: 
                                                                [
                                                                    { path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }]})
                                                   .lean();
    if (applications.length === 0) throw new Error("No internship applications found!");
    const formatted = applications.map(({ student, cv, ...rest }) => ({ student, 
                                                                        cvUrl: cv?.fileUrl ? `http://localhost:3000${cv.fileUrl}` : null,
                                                                        ...rest }));
    return formatted;
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
module.exports = 
{
    register,
    getAll,
    toUpdate,
    toDelete,
    myApplicationsAsStudent,
    searchByStatus,
    acceptedStudents,
    updateMyCV,
    getAllApplicants,
    getStudentCV
}