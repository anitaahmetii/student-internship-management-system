const taskService = require('../services/task.service');

const registerTask = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;
        const { title, description, requirements, maxPoints } = req.body;
        const task = await taskService.add(req.user._id, internshipId, title, description, requirements, maxPoints);
        return res.status(201).json(task);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}
const getTasksAsMentor = async (req, res) =>
{
    try
    {
        const { internshipId } = req.params;
        const tasks = await taskService.getTasks(req.user._id, internshipId);
        return res.status(201).json(tasks);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = 
{
    registerTask,
    getTasksAsMentor
}