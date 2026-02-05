const State = require('../models/State');

const add = async (name, code) =>
{
    try
    {
        const { exists } = await stateExists(name);
        if (exists) throw new Error(`State already exists!`);

        const findCode = await codeExists(code);
        if (findCode) throw new Error(`Code already exists!`);

        const state = new State({ name , code });
        return await state.save();
    }
    catch(err)
    {
        throw new Error(`Database error while creating state: ${err.message}`);
    }
}
const get = async () =>
{
    const states = await State.find({});
    if (states.length === 0) throw new Error("No states found!");
    return states;
}
const update = async (state, stateName, code) => 
{
    try
    {
        const { exists } = await stateExists(state);
        if (!exists) throw new Error(`State not found!`);

        const findStateName = await stateExists(stateName);
        if (findStateName.exists) throw new Error(`State already exists!`);

        const findCode = await codeExists(code);
        if (findCode) throw new Error(`Code already exists!`);

        const toUpdate = await State.findOneAndUpdate({ name: state }, 
                                                    { name: stateName, code: code }, 
                                                    { new: true, runValidators: true });
        return toUpdate;
    }
    catch(err)
    {
        throw new Error(`Database error while updating state: ${err.message}`)
    }
}
const toDelete = async (state) =>
{
    try
    {
        const { exists } = await stateExists(state);
        if (!exists) throw new Error(`State not found!`);

        const deleteState = await State.findOneAndDelete({ name: state });
        return deleteState;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting state: ${err.message}`)
    }
}
const stateExists = async (stateName) =>
{
    const findState = await State.findOne({ name: stateName });
    return { exists: !!findState, id: findState?._id };
}
const codeExists = async (codeName) =>
{
    const findCode = await State.findOne({ code: codeName });
    return !!findCode;
}

module.exports = { add, get, update, toDelete };