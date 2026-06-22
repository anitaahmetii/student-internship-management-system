const enrollmentService = require('../services/enrollment.service');

const registerEnrollment = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;
        const { mentorEmail, studentEmails } = req.body;

        if (!Array.isArray(studentEmails)) return res.status(400).json({ success: false, message: "studentEmails must be an array" });
        
        const register = await enrollmentService.register(req.user._id, internshipId, mentorEmail, studentEmails);
        res.status(201).json(register);
    }
    catch(err)
    {
        return res.status(500).json({ success: false, message: err.message });
    }
}
const getMyStudentsAsMentor = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;

        const enrollments = await enrollmentService.getMyStudents(req.user._id, internshipId);

        res.status(200).json(enrollments);
    }
    catch(err)
    {
        res.status(500).json(err.message);
        console.log(err.message);
    }
}
module.exports =
{
    registerEnrollment,
    getMyStudentsAsMentor
}