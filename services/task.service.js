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
const taskExists = async (taskId) =>
{
   return !!await Task.exists({ _id: taskId });
}
const validateTaskOwnership = async (mentorId, taskId) =>
{
    return !!await Task.exists({ _id: taskId, createdBy: mentorId });
}
const getById = async (mentorId, taskId) =>
{
    return await Task.findOne({ _id: taskId, createdBy: mentorId });
}
const getInternshipByTask = async (taskId) =>
{
    const task = await Task.findById(taskId);
    return task.internship;
}
const getTasksByMentor = async (mentorId) => 
{
    const tasks = await Task.find({ createdBy: mentorId }).select('_id').lean();
    return tasks.map(t => t._id);
}
module.exports = 
{
    add,
    getTasks,
    taskExists,
    validateTaskOwnership,
    getById,
    getInternshipByTask,
    getTasksByMentor
}