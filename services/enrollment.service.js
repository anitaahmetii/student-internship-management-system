const InternshipEnrollment = require('../models/InternshipEnrollment');
const applicationService = require('./applications.service');
const userService = require('./user.service');
const internshipService = require('./internship.service');

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

module.exports = 
{
    register
}