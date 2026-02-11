const applicationService = require('../services/applications.service');

const uploadApplication = async (req, res) =>
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const { internship } = req.params;

        const applicationInternship = await applicationService.register(token, internship);
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
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const { application } = req.params;
        const { status, feedback, isVisible } = req.body;

        const updated = await applicationService.toUpdate(application, token, status, feedback, isVisible);
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
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const { application } = req.params;
        const deleted = await applicationService.toDelete(application, token);
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
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const applications = await applicationService.myApplicationsAsStudent(token);
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
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const applications = await applicationService.myApplicationsAsHr(token);
        res.status(200).json(applications);
    }
    catch(err)
    {
        res.status(409).json(err.message);
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
    getHrApplications
}