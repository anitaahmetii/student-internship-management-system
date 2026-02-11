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

module.exports = 
{
    uploadApplication
}