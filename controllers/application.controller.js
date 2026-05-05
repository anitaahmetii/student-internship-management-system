const applicationService = require('../services/applications.service');

const uploadApplication = async (req, res) =>
{
    try
    {
        const { internship } = req.params;

        const applicationInternship = await applicationService.register(req.user._id, internship);
        res.status(201).json(applicationInternship);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
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
        console.log(err.message);
    }
}
const updateApplication = async (req, res) =>
{
    try
    {
        const { application } = req.params;
        const { status, feedback, isVisible } = req.body;

        const updated = await applicationService.toUpdate(application, req.user._id, status, feedback, isVisible);
        res.status(200).json(updated);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
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
        console.log(err.message);
    }
}
const getStudentApplications = async (req, res) =>
{
    try
    {
        const applications = await applicationService.myApplicationsAsStudent(req.user._id);
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getHrApplications = async (req, res) =>
{
    try
    {
        const applications = await applicationService.myApplicationsAsHr(req.user._id);
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
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
        console.log(err.message);
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
        console.log(err.message);
    }
}
module.exports = 
{
    uploadApplication,
    getAllApplications,
    updateApplication,
    deleteApplication,
    getStudentApplications,
    getHrApplications,
    getApplicationsByStatus,
    getAcceptedStudentsByInternship
}