require('dotenv').config();
const ProgressTracker = require('../models/ProgressTracker');
const enrollmentService = require('./enrollment.service');
const taskService = require('./task.service');

const assignToAll = async (mentorId, taskId) => 
{
    try
    {
        const taskExists = await taskService.taskExists(taskId)
        if (!taskExists) throw new Error("Task not found!");

        const isOwner = await taskService.validateTaskOwnership(mentorId, taskId);
        if (!isOwner) throw new Error("Task not available");

        const internshipId = await taskService.getInternshipByTask(taskId);

        const enrollments = await enrollmentService.getEnrollmentsByInternship(mentorId, internshipId);
        if (!enrollments.length) return [];

        const progressDocs = enrollments.map(e => ({ enrollment: e, task: taskId }));

        return await ProgressTracker.insertMany(progressDocs);
    }
    catch(err)
    {
        throw new Error(`Database error occurred while assigning task to students: ${err.message}`);
    }
}
const uniqueAssign = async (mentorId, taskId, studentEmails) =>
{
    try
    {
        const taskExists = await taskService.taskExists(taskId)
        if (!taskExists) throw new Error("Task not found!");

        const isOwner = await taskService.validateTaskOwnership(mentorId, taskId);
        if (!isOwner) throw new Error("Task not available");

        const internshipId = await taskService.getInternshipByTask(taskId);

        const enrollments = await enrollmentService.getEnrollmentsByStudentsAndInternship(mentorId, internshipId, studentEmails);
        if (!enrollments.length) return [];

        const progressDocs = enrollments.map(e => ({ enrollment: e, task: taskId }));
        return await ProgressTracker.insertMany(progressDocs);
        
    }
    catch(err)
    {
        throw new Error(`Database error occurred while assigning task to students: ${err.message}`);
    }
}
const getByTask = async (mentorId, taskId) => 
{
    try 
    {
        const taskExists = await taskService.taskExists(taskId)
        if (!taskExists) throw new Error("Task not found!");

        const isOwner = await taskService.validateTaskOwnership(mentorId, taskId);
        if (!isOwner) throw new Error("Task not available");

        const datas = await ProgressTracker.find({ task: taskId })
                                            .select('-_id -isVisible -createdAt -updatedAt -__v')
                                            .populate({ path: 'task', select: '-_id -isVisible -createdAt -updatedAt -__v' })
                                            .populate({ path: 'enrollment', populate: [{ path: 'internship', select: 'position -_id' },
                                                                                        { path: 'student', select: 'email -_id' }] })
                                            .lean();
        return datas;
    }
    catch(err)
    {
        throw new Error(`Database error occurred while retrieving tasks: ${err.message}`);
    }
}
const getAll = async (mentorId) =>
{
    try
    {
        const tasks = await taskService.getTasksByMentor(mentorId);
        const datas = await ProgressTracker.find({ task: { $in: tasks }})
                                            .populate({ path: 'task', select: '-_id -isVisible -createdAt -updatedAt -__v' })
                                            .populate({ path: 'enrollment', populate: [{ path: 'internship', select: 'position -_id' },
                                                                                        { path: 'student', select: 'email -_id' }] })
                                            .lean();
        return datas;
    }
    catch(err)
    {
        throw new Error(`Database error occurred while retrieving tasks: ${err.message}`);
    }
}
module.exports = 
{ 
    assignToAll,
    uniqueAssign,
    getByTask,
    getAll
}