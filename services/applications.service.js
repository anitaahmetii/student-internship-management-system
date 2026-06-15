require('dotenv').config();
const InternshipApplication = require('../models/InternshipApplication');
const jwt = require('jsonwebtoken');
const internshipService = require('./internship.service');
const Internship = require('../models/Internship');
const fs = require('fs');
const path = require('path');
const userService = require('./user.service');
const { application } = require('express');

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
                                                                        { new: true, runValidators: true})
                                                                        .populate({ path: 'student', select: 'email -_id'})
                                                                        .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                                    populate: 
                                                                                    [{ path: 'location', select: 'name -_id' },
                                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                                    { path: 'updatedBy', select: 'email -_id' }]})
                                                                        .lean();

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
const getAllApplicantsById = async (hrId, internshipId) => 
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
        throw new Error(`Failed to retrieve applicants by internship: ${err.message}`)
    }
}
const getAllApplicants = async (hrId) =>
{
    try
    {
        const internshipIds = await internshipService.getInternshipIdsUploadedByHr(hrId);
        const applications = await InternshipApplication.find({ internship: { $in: internshipIds }})
                                                        .select('-isVisible -createdAt -updatedAt -__v')
                                                        .populate({ path: 'student', select: 'email -_id'})
                                                        .populate({ path: 'internship', select: '-_id -isVisible -createdAt -updatedAt -__v', 
                                                                    populate: 
                                                                    [{ path: 'location', select: 'name -_id' },
                                                                    { path: 'uploadedBy', select: 'email -_id' },
                                                                    { path: 'updatedBy', select: 'email -_id' }]})
                                                        .lean();
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
        console.log("ne service");
        const application = await InternshipApplication.findById(applicationId).select('internship');
        if (!application) throw new Error("Application not found!");
        console.log("Application: " + application.internship);
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
                                                        .populate({ path: 'internship', select: 'applicationDeadline position -_id', 
                                                                    populate: [{ path: 'location', select: 'name -_id' }]})
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
const analyzeCV = async (hrId, applicationId) => 
{
    try
    {
        const application = await InternshipApplication.findById(applicationId)
                            .populate({ path: 'internship', select: 'position preRequirements responsibilities' });
        
        if (!application) throw new Error("Application not found!");
    
        const internshipData = await internshipService.getById(application.internship._id);
        if (!internshipData.hr.equals(hrId)) throw new Error("Not authorized!");

        if (!application.cv?.fileUrl) throw new Error("CV not found!");

        const filePath = path.join(__dirname, '../public', application.cv.fileUrl);
        const fileBuffer = await fs.promises.readFile(filePath);
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(fileBuffer);
        const cvText = pdfData.text;

        const internship = application.internship;

        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `You are an HR assistant. Analyze this CV for the internship position and respond ONLY with a valid JSON object, no extra text.

                        Internship Position: ${internship.position}
                        Requirements: ${internship.preRequirements.join(', ')}
                        Responsibilities: ${internship.responsibilities.join(', ')}

                        CV Content:
                        ${cvText}

                        Respond ONLY with this JSON format:
                        {
                        "score": <number 0-100>,
                        "summary": "<2-3 sentences about the candidate>",
                        "matchedSkills": ["skill1", "skill2"],
                        "missingSkills": ["skill1", "skill2"]
                        }`;

        const groqResponse = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3
        });

        const raw = groqResponse.choices[0].message.content.trim();
        const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        const result = JSON.parse(cleaned);
        return result;
    }
    catch(err)
    {
        throw new Error(`${err.message}`);
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
    getAllApplicantsById,
    getAllApplicants,
    getStudentCV,
    analyzeCV
}