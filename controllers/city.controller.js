const cityService = require('../services/city.service');

const createCity = async (req, res) => 
{
    try
    {
        const { name, state } = req.body;
        const addCity = await cityService.add(name, state);
        return res.status(201).json(addCity);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getCities = async (req, res) =>
{
    try
    {
        const cities = await cityService.get();
        return res.status(200).json(cities);
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
const updateCity = async (req, res) => 
{
    try 
    {
        const { city } = req.params;
        const { name, state } = req.body;

        const updatedCity = await cityService.update(city, name, state);
        return res.status(200).json(updatedCity);
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
const deleteCity = async (req, res) =>
{
    try 
    { 
        const { city, state } = req.params;
        await cityService.toDelete(city, state);
        return res.status(200).json("City deleted successfully!");
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
module.exports = { createCity, getCities, updateCity, deleteCity };