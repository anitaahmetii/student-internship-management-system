const enrollmentService = require('../services/enrollment.service');

const registerEnrollment = async (req, res) =>
{
    try
    {
        const { position, mentor } = req.body;

        const register = await enrollmentService.register(req.user._id, position, mentor);
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
        const { position } = req.params;

        const enrollments = await enrollmentService.getAll(req.user._id, position);
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