const stateService = require('../services/state.service');

const createState = async (req, res) => 
{
    try
    {
        const { name, code } = req.body;
        const addState = await stateService.add(name, code);
        return res.status(201).json(addState);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getStates = async (req, res) => 
{
    try 
    {
        const states = await stateService.get();
        return res.status(200).json(states);
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
const updateState = async (req, res) => 
{
    try
    {
        const { name } = req.params;
        const { name: stateName, code } = req.body;

        const updatedState = await stateService.update(name, stateName, code); 
        return res.status(200).json(updatedState);
    }
    catch(err)
    {
        res.status(err.status || 400).json(err.message);
        console.log(err.message);
    }
}
const deleteState = async (req, res) => 
{
    try
    {
        const { name } = req.params;
        await stateService.toDelete(name);
        return res.status(200).json("State deleted successfully!");
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
module.exports = { createState, getStates, updateState, deleteState };