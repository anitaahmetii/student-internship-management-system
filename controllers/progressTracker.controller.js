const progressTrackerService = require('../services/progressTracker.service');

const assignTaskToStudents = async (req, res) =>
{
    try
    {
        const { taskId } = req.params;
        const assign = await progressTrackerService.assignToAll(req.user._id, taskId);
        res.status(201).json(assign);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const assignUniqueTaskToStudents = async (req, res) =>
{
    try
    {
        const { taskId } = req.params;
        const { studentEmails } = req.body;

        if (!Array.isArray(studentEmails)) return res.status(400).json({ success: false, message: "studentEmails must be an array" });

        const assign = await progressTrackerService.uniqueAssign(req.user._id, taskId, studentEmails);
        res.status(201).json(assign);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const getProgressTrackerByTask = async (req, res) =>
{
    try
    {
        const { taskId } = req.params;
        const tasks = await progressTrackerService.getByTask(req.user._id, taskId);

        res.status(201).json(tasks);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const getAllProgressTrackers = async (req, res) =>
{
    try
    {
        const tasks = await progressTrackerService.getAll(req.user._id);
        res.status(201).json(tasks);
    }
    catch(err)
    {
        res.status(409).json(err.message);
    }
}
const getMyTasksAsStudent = async (req, res) => 
{
    try
    {
        const studentData = await progressTrackerService.getMyTasks(req.user._id);
        res.status(200).json(studentData);
    }
    catch (err)
    {
        res.status(409).json(err.message);
    }
}
module.exports = 
{
    assignTaskToStudents,
    assignUniqueTaskToStudents,
    getProgressTrackerByTask,
    getAllProgressTrackers,
    getMyTasksAsStudent
}