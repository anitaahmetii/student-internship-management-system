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

module.exports =
{
    registerEnrollment
}