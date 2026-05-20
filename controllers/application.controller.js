const applicationService = require('../services/applications.service');
const fs = require('node:fs');

const applyForInternship = async (req, res) =>
{
    try
    {
        const { internship } = req.params;

        const file = req.file;
        if (!file) return res.status(400).json("CV is required!");

        const applicationInternship = await applicationService.register(req.user._id, internship, file);
        
        req.io.to('hr-room').emit('new-application', applicationInternship);
        res.status(201).json(applicationInternship);
    }
    catch(err)
    {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(500).json(err.message);
    }
}
const updateMyCvAsStudent = async (req, res) =>
{
    try
    {
        const file = req.file;
        if (!file) return res.status(400).json("CV is required!");
        const { internshipId } = req.params;


        const updatedCV  = await applicationService.updateMyCV(req.user._id,  internshipId, file);
        req.io.to('hr-room').emit('cv-updated', updatedCV);
        res.status(200).json(updatedCV);
    }
    catch (err)
    {
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json(err.message);
    }
}
const getAllApplicantsByIdByIdAsHR = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;
        const applicants = await applicationService.getAllApplicantsById(req.user._id, internshipId);
        res.status(200).json(applicants);
    }
    catch (err)
    {
        res.status(500).json(err.message);
    }
}
const getAllApplicantsAsHr = async (req, res) =>
{
    try
    {
        const applicants = await applicationService.getAllApplicantsById(req.user._id, internshipId);
        const applicants = await applicationService.getAllApplicantsById(req.user._id, internshipId);
        res.status(200).json(applicants);
    }
    catch (err)
    {
        res.status(500).json(err.message);
    }
}
const getAllApplicantsAsHr = async (req, res) =>
{
    try
    {
        const applicants = await applicationService.getAllApplicants(req.user._id);
        
        const isHtml = req.headers.accept?.includes('text/html');
        if (isHtml)
        {
            return res.render('hrDashboard', { applicants });
        }
        res.status(200).json(applicants);
    }
    catch (err)
    {
        res.status(500).json(err.message);
    }
}
const getStudentCVAsHR = async (req, res) => 
{
    try
    {
        const { internshipId, studentEmail} = req.params;
        const cv = await applicationService.getStudentCV(req.user._id, internshipId, studentEmail);
        res.status(200).json({ cvUrl: cv });
    }
    catch (err)
    {
        res.status(500).json(err.message);
    }
}
const updateApplication = async (req, res) =>
{
    try
    {
        const { applicationId } = req.params;
        const { status, feedback, isVisible } = req.body;

        const updated = await applicationService.toUpdate(req.user._id, applicationId, status, feedback, isVisible);
        req.io.to('student-room').emit('application-update', updated);
        res.status(200).json(updated);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}
const getStudentApplications = async (req, res) =>
{
    try
    {
        const applications = await applicationService.myApplicationsAsStudent(req.user._id);
        
        const isHtml = req.headers.accept?.includes('text/html');
        if (isHtml)
        {
            return res.render('studentDashboard', { applications });
        }
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const getApplicationsByStatus = async (req, res) =>
{
    try
    {
        const { status } = req.params;

        const applications = await applicationService.searchByStatus(req.user._id, status);
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const getAcceptedStudentsByInternship = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;
        const result  = await applicationService.acceptedStudents(req.user._id, internshipId);
        res.status(200).json(result );
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}
const getAllApplications = async (req, res) =>
{
    try
    {
        const applications = await applicationService.getAll();
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const deleteApplication = async (req, res) =>
{
    try
    {

        const { application } = req.params;
        const deleted = await applicationService.toDelete(application, req.user._id);
        res.status(200).json(deleted);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
module.exports = 
{
    applyForInternship,
    getAllApplications,
    updateApplication,
    deleteApplication,
    getStudentApplications,
    getApplicationsByStatus,
    getAcceptedStudentsByInternship,
    updateMyCvAsStudent,
    getAllApplicantsByIdAsHR,
    getStudentCVAsHR,
    getAllApplicantsAsHr
}