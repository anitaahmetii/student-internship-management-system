const City = require('../models/City');
const stateService = require('./state.service');

const add = async (cityName, stateName) => 
{
    try
    {
        const { exists, id: stateId } = await stateService.stateExists(stateName);
        if (!exists) throw new Error('State not found!');

        const existsInState  = await cityExistsInState(cityName, stateId);
        if (existsInState ) throw new Error('A city within that state already exists.');

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
const update = async (cityParam, stateParam, cityName, stateName) => 
{
    try
    {
        const { id: stateIdParam } = await stateService.stateExists(stateParam);


        const cityAndStateInParams = await cityExistsInState(cityParam, stateIdParam);
        if (!cityAndStateInParams) throw new Error('A city within that state not found!');
        
        const { exists: stateInBody, id: stateIdBody } = await stateService.stateExists(stateName);
        if (!stateInBody) throw new Error('State not available!');
        
        if (cityName) 
        {
            const cityAndStateInBody = await cityExistsInState(cityName, stateIdBody);
            if (cityAndStateInBody) throw new Error('A city within that state already exists!');
        }

        if(!cityName) 
        {
            const cityAndStateInBody = await cityExistsInState(cityParam, stateIdBody);
            if (cityAndStateInBody) throw new Error('A city within that state already exists!');
        }

        const toUpdate = await City.findOneAndUpdate({ name: cityParam, state: stateIdParam },
                                                    { name: cityName, state: stateIdBody },
                                                    { new: true, runValidators: true });
        return toUpdate;
    }
    catch(err)
    {
        throw new Error(`Database error while updating city: ${err.message}`)
    }
}
const toDelete = async (cityName, stateName) => 
{
    try
    {
        const { exists, id: stateId } = await stateService.stateExists(stateName);
        if (!exists) throw new Error("State not found!");

        const existsCityState = await cityExistsInState(cityName, stateId);
        if (!existsCityState) throw new Error('A city within that state not found!');

        const deleteCity = await City.findOneAndDelete({ name: cityName, state: stateId });
        return deleteCity;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting city: ${err.message}`);
    }
}
const cityExistsInState = async (cityName, stateId) => 
{
    return await City.exists({ name: cityName, state: stateId });
};
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

module.exports = { add, get, update, toDelete, findCityState, findStateCity };