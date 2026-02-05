const City = require('../models/City');
const stateService = require('./state.service');

const add = async (cityName, state) => 
{
    try
    {
        const { exists: stateName, id: stateId } = await stateService.stateExists(state);
        if (!stateName) throw new Error('State not found!');

        const { cityExists, stateExists } = await cityAndStateExists(cityName);
        if (cityExists && stateExists) throw new Error('A city within that state already exists.');

        const city = new City({ name: cityName, state: stateId });
        return await city.save();
    }
    catch(err)
    {
        throw new Error(`Database error while creating city: ${err.message}`);
    }
}
const get = async () => 
{
   const cities = await City.find({});
   if (cities.length === 0) throw new Error("No cities found!");
   return cities;
}
const update = async (city, cityName, state) => 
{
    try
    {
        let stateName, stateId;
        if (state)
        {
            ({ exists: stateName, id: stateId } = await stateService.stateExists(state));
            if (!stateName) throw new Error('State not found!');
        }

        const { cityExists, stateExists } = await cityAndStateExists(cityName);
        if (cityExists && stateExists) throw new Error('A city within that state already exists.');

        const toUpdate = await City.findOneAndUpdate({ name: city },
                                                    { name: cityName, state: stateId ?? state },
                                                    { new: true, runValidators: true });
        return toUpdate;
    }
    catch(err)
    {
        throw new Error(`Database error while updating city: ${err.message}`)
    }
}
const toDelete = async (city, state) => 
{
    try
    {
        const { exists, id: stateId } = await stateService.stateExists(state);
        if (!exists) throw new Error("State not found!");

        const { cityExists, stateExists } = await cityAndStateExists(city);
        if (!cityExists && !stateExists) throw new Error('A city within that state not found!');

        const deleteCity = await City.findOneAndDelete({ name: city, state: stateId });
        return deleteCity;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting city: ${err.message}`);
    }
}
const cityAndStateExists = async (city) =>
{
    const findCity = await City.findOne({ name: city });
    return { cityExists: !!findCity, id: findCity?._id, stateExists: !!findCity?.state };
}
const findCityState = async (state) => 
{
    try
    {
        const { exists, id: stateId } = await stateService.stateExists(state);
        if (!exists) throw new Error("State not found!");

        const cities = await City.find({ state: stateId })
                                 .populate({ path: 'state', select: 'name -_id'})
                                 .lean();
        return cities;

    }
    catch(err)
    {
        throw new Error(`An error occurred while filtering cities by state: ${err.message}`);
    }
}
const findStateCity = async (city) =>
{
    try
    {
        const cityExists = await findCity(city);
        if (!cityExists) throw new Error("No city found!");

        const cityState = await City.find({ name: city }).populate({ path: 'state', select: 'name -_id'});
        
        return cityState.map(c => ({ city: c.name, state: c.state }));
    }
    catch(err)
    {
        throw new Error(`An error occurred while filtering state by city: ${err.message}`);
    }
}
const findCity = async(cityName) => 
{
    return await City.exists({ name: cityName });
}
module.exports = { add, cityAndStateExists, get, update, toDelete, findCityState, findStateCity };