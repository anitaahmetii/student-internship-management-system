require('dotenv').config();
const InternshipEnrollment = require('../models/InternshipEnrollment');
const applicationService = require('./applications.service');
const userService = require('./user.service');
const internshipService = require('./internship.service');
const jwt = require('jsonwebtoken');

const register = async (hrToken, position, mentorEmail) => 
{
    try
    {

        const { exists: positionAvailable, id: positionId } = await internshipService.getIdByPositionName(position);
        if (!positionAvailable) throw new Error("Position not found!");

        const reviewedApplications = await applicationService.getStudentsForEnrollments(hrToken, positionId);

        const { exists: mentorAvailable, userId: idMentor } = await userService.checkEmail(mentorEmail);
        if (!mentorAvailable) throw new Error("Mentor not found!"); 

        const enrollmentData = reviewedApplications.map(e => ({
                                                            internship: e.internship,
                                                            student: e.student,
                                                            mentor: idMentor
                                                        }));
        const enrollment = await InternshipEnrollment.insertMany(enrollmentData);
        return enrollment;
    }
    catch(err)
    {
        throw new Error(`Database error while enrollment: ${err.message}`);
    }
}
const getAll = async (mentorToken, internshipName) =>
{
    try
    {
        const mentorUser = jwt.verify(mentorToken, process.env.ACCESS_TOKEN_SECRET);
        const { _id: mentorUserId, email: mentorUserEmail } = mentorUser;
        const { exists: internshipAvailable, id: internshipId } = await internshipService.getIdByPositionName(internshipName);
        if (!internshipAvailable) throw new Error("Internship not found"); 

        const internshipEnrollments = await InternshipEnrollment.find({ mentor: mentorUserId, internship: internshipId })
                                                                .select('-isVisible -createdAt -updatedAt -__v')
                                                                .populate({ path: 'student', select: 'email -_id' })
                                                                .lean();
        return { internship: internshipName, mentor: mentorUserEmail, students: internshipEnrollments.map(s => s.student.email)};
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving enrollments: ${err.message}`);
    }
}
module.exports = 
{
    register,
    getAll
}