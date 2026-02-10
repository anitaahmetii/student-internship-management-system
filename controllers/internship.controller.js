const internshipService = require('../services/internship.service');

const uploadInternship = async (req, res) =>
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const { position, companyName, preRequirements, responsibilities, 
                applicationDeadline, location, isVisible } = req.body;
        const uploadedInternship = await internshipService.register(token,
                                                                    position, 
                                                                    companyName, 
                                                                    preRequirements, 
                                                                    responsibilities, 
                                                                    applicationDeadline, 
                                                                    location,  
                                                                    isVisible);
        return res.status(201).json(uploadedInternship);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getInternships = async (req, res) =>
{
    try 
    {
        const internships = await internshipService.getAll();
        res.status(200).json(internships);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const updateInternship = async (req, res) => 
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const { internship } = req.params;
        const { position, companyName, preRequirements, 
                responsibilities, applicationDeadline, location, isVisible } = req.body;
        
        const updatedInternship = await internshipService.toUpdate(internship, 
                                                                    token,
                                                                    position, 
                                                                    companyName, 
                                                                    preRequirements, 
                                                                    responsibilities, 
                                                                    applicationDeadline, 
                                                                    location, 
                                                                    isVisible );
        res.status(200).json(updatedInternship);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const deleteInternship = async (req, res) => 
{
    try
    {
        const { internship } = req.params;
        const deletedInternship = await internshipService.toDelete(internship);
        res.status(200).json(deletedInternship);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getActiveInternships = async (req, res) =>
{
    try
    {
        const internships = await internshipService.active();
        res.status(200).json(internships);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getInActiveInternships = async (req, res) =>
{
    try
    {
        const internships = await internshipService.inActive();
        res.status(200).json(internships);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getHRInternships = async (req, res) =>
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const internships = await internshipService.myInternships(token);
        res.status(200).json(internships);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
module.exports =
{
    uploadInternship,
    getInternships,
    updateInternship,
    deleteInternship,
    getActiveInternships,
    getInActiveInternships,
    getHRInternships
}