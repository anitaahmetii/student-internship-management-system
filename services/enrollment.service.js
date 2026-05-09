require('dotenv').config();
const InternshipEnrollment = require('../models/InternshipEnrollment');
const applicationService = require('./applications.service');
const userService = require('./user.service');
const internshipService = require('./internship.service');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (hrId, internshipId, mentorEmail, studentEmails) => 
{
    try
    {

        const internshipData = await internshipService.getById(internshipId);

        if (!internshipData.exists) throw new Error("Internship does not exist");
        if (!internshipData.hr.equals(hrId)) throw new Error("You are not responsible for this internship!");

        const { exists: mentorAvailable, userId: mentorId } = await userService.checkEmail(mentorEmail);
        if (!mentorAvailable) throw new Error("Mentor not found!"); 

        const students = await User.find({ email: { $in: studentEmails }});
        const foundEmails = students.map(s => s.email);
        const notFound = studentEmails.filter(email => !foundEmails.includes(email));
        if (students.length !== studentEmails.length) throw new Error(`These students were not found: ${notFound.join(", ")}`);

        const enrollmentData = students.map(s => ({ internship: internshipId,
                                                    student: s._id,
                                                    mentor: mentorId
                                            }));

        return await InternshipEnrollment.insertMany(enrollmentData);
    }
    catch(err)
    {
        throw new Error(`Database error while enrollment: ${err.message}`);
    }
}
const getMyStudents = async (mentorId, internshipId) =>
{
    try
    {
        const internshipAvailable = await internshipService.getById(internshipId);
        if (!internshipAvailable.exists) throw new Error("Internship not found"); 

        const internshipEnrollments = await InternshipEnrollment.find({ mentor: mentorId, internship: internshipId })
                                                                .select('-isVisible -createdAt -updatedAt -__v')
                                                                .populate({ path: 'student', select: 'email _id' })
                                                                .lean();

        if (internshipEnrollments.length === 0) throw new Error("You are not responsible for this internship!");

        const internshipPosition = await internshipService.getPositionById(internshipId);
                                                                   
        return { internship: internshipPosition,
                students: internshipEnrollments.map(s => s.student?.email).filter(Boolean)
               };
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving enrollments: ${err.message}`);
    }
}
const isMentorAssigned = async (mentorId, internshipId) =>
{
    return !!await InternshipEnrollment.exists({ mentor: mentorId, internship: internshipId });
}
const getEnrollmentsByInternship = async (mentorId, internshipId) =>
{
    const enrollments = await InternshipEnrollment.find({ mentor: mentorId, internship: internshipId })
                                                .select('_id')
                                                .lean();
    return enrollments.map(e => e._id);
}
const getEnrollmentsByStudentsAndInternship = async (mentorId, internshipId, studentEmails) =>
{
    const students = await User.find({ email: { $in: studentEmails }});
    const foundEmails = students.map(s => s.email);
    const notFound = studentEmails.filter(email => !foundEmails.includes(email));
    if (students.length !== studentEmails.length) throw new Error(`These students were not found: ${notFound.join(", ")}`);

    const enrollments = await InternshipEnrollment.find({ mentor: mentorId, internship: internshipId, student: { $in: students.map(s => s._id) }})
                                                .select('_id')
                                                .lean();
    return enrollments.map(e => e._id);
}
module.exports = 
{
    register,
    getMyStudents,
    isMentorAssigned,
    getEnrollmentsByInternship,
    getEnrollmentsByStudentsAndInternship
}