const enrollmentService = require('../services/enrollment.service');

const registerEnrollment = async (req, res) =>
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const { position, mentor } = req.body;

        const register = await enrollmentService.register(token, position, mentor);
        res.status(201).json(register);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getEnrollments = async (req, res) =>
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        const { position } = req.params;

        const enrollments = await enrollmentService.getAll(token, position);
        res.status(200).json(enrollments);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
module.exports =
{
    registerEnrollment,
    getEnrollments
}