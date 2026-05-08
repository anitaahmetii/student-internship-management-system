require('dotenv').config();
const Task = require('../models/Task');
const enrollmentService = require('./enrollment.service');
const internshipService = require('./internship.service');

const add = async (mentorId, internshipId, title, description, requirements, maxPoints) =>
{
    try 
    {
        const internshipData = await internshipService.getById(internshipId);
        if (!internshipData.exists) throw new Error("Internship not found!");

        const assigned = await enrollmentService.isMentorAssigned(mentorId, internshipId);
        if (!assigned) throw new Error("Not authorized!");

        const task = new Task({ internship: internshipId, title, description, requirements, maxPoints, createdBy: mentorId });
        return await task.save();
    }
    catch(err)
    {
        throw new Error(`Database error while adding the task: ${err.message}`);
    }
}
const getTasks = async (mentorId, internshipId) =>
{
    try
    {
        const internshipData = await internshipService.getById(internshipId);
        if (!internshipData.exists) throw new Error("Internship not found!");

        const assigned = await enrollmentService.isMentorAssigned(mentorId, internshipId);
        if (!assigned) throw new Error("Not authorized!");

        const tasks = await Task.find({ createdBy: mentorId, internship: internshipId })
                                .select('-_id -__v -updatedAt -createdBy -createdAt')
                                .populate({ path: 'internship', select: 'position -_id'})
                                .lean();
        return tasks;
    }
    catch(err)
    {
        throw new Error(`Failed to retrieve tasks: ${err.message}`);
    }
}

module.exports = 
{
    add,
    getTasks
}