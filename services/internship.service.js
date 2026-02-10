const Internship = require('../models/Internship');
const userService = require('./user.service');
const cityService = require('./city.service');

const register = async (token, position, companyName, preRequirements, responsibilities, 
                        applicationDeadline, location, isVisible) =>
{
    try
    {
        const loggedUser = await userService.current(token);
        const { _id: loggedUserId } = loggedUser;
        
        const { exists: cityExists, cityId } = await cityService.findCity(location);
        if (!cityExists) throw new Error("City not found!");

        const internship = new Internship({ position, companyName, preRequirements, responsibilities, 
                                            applicationDeadline, location: cityId, 
                                            uploadedBy: loggedUserId, isVisible});
        return await internship.save();
    }
    catch(err)
    {
        throw new Error(`Database error while uploading internship: ${err.message}`);
    }
}
const getAll = async () => 
{
    try 
    {
        const internships = await Internship.find({})
                                            .populate({ path: 'location', select: 'name -_id'})
                                            .populate({ path: 'uploadedBy', select: 'email -_id'})
                                            .populate({ path: 'updatedBy', select: 'email -_id'})
                                            .lean();
        return internships;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving internships: ${err.message}`);
    }
}
const getById = async (internshipId) => 
{
    const exists = await Internship.findById({ _id: internshipId });
    return !!exists; 
}
const toUpdate = async (internshipId, token, position, companyName, preRequirements, 
                      responsibilities, applicationDeadline, location, isVisible) =>
{
    try 
    {
        const internshipExists = await getById(internshipId);
        if (!internshipExists) throw new Error('Internship not found!');

        const loggedUser = await userService.current(token);
        const { _id: loggedUserId } = loggedUser;

        let cityAvailable, locationId;
        if (location)
        {
            ({ exists: cityAvailable, cityId: locationId } = await cityService.findCity(location));
            if (!cityAvailable) throw new Error("City not found!");
        }

        const updateInternship = await Internship.findByIdAndUpdate({ _id: internshipId },
                                                                    { position, 
                                                                      companyName,
                                                                      preRequirements,
                                                                      responsibilities, 
                                                                      applicationDeadline,
                                                                      location: locationId, 
                                                                      updatedBy: loggedUserId,
                                                                      isVisible },
                                                                    { new: true, runValidators: true });
        return updateInternship;
    }
    catch(err)
    {
        throw new Error(`Database error while updating internships: ${err.message}`);
    }
}
const toDelete = async (internshipId) => 
{
    try 
    {
        const deleteInternship = await Internship.findByIdAndDelete({ _id: internshipId });
        if (!deleteInternship) throw new Error('Internship not found!');
        return deleteInternship;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting internships: ${err.message}`);
    }
}
const active = async () => 
{
    try
    {
        const activeInternships = await Internship.find({ applicationDeadline: { $gte: Date.now() }})
                                                  .select('-isVisible -createdAt -updatedAt -__v')
                                                  .populate({ path: 'location', select: 'name -_id' })
                                                  .populate({ path: 'uploadedBy', select: 'email -_id' })
                                                  .populate({ path: 'updatedBy', select: 'email -_id' })
                                                  .lean();
        if (activeInternships.length === 0) throw new Error("No internships available!");                                          
        return activeInternships;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving active internships: ${err.message}`);
    }
}
const inActive = async () => 
{
    try
    {
        const inActiveInternships = await Internship.find({ applicationDeadline: { $lt: Date.now() }})
                                                  .select('-isVisible -createdAt -updatedAt -__v')
                                                  .populate({ path: 'location', select: 'name -_id' })
                                                  .populate({ path: 'uploadedBy', select: 'email -_id' })
                                                  .populate({ path: 'updatedBy', select: 'email -_id' })
                                                  .lean();
        if (inActiveInternships.length === 0) throw new Error("No internships available!");                                          
        return inActiveInternships;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving not active internships: ${err.message}`);
    }
}
const myInternships = async (token) => 
{
    try 
    {
        const hrUser = await userService.current(token);
        const hrUserId = hrUser._id;

        const hrInternships = await Internship.find({ $or: [{ uploadedBy: hrUserId },{ updatedBy: hrUserId }]})
                                              .populate({ path: 'location', select: 'name -_id' })
                                              .populate({ path: 'uploadedBy', select: 'email -_id' })
                                              .populate({ path: 'updatedBy', select: 'email -_id' })
                                              .lean();
        if (hrInternships.length === 0) return "You haven’t uploaded any internships.";
        return hrInternships;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving your internships: ${err.message}`);
    }
}
module.exports = 
{
    register,
    getAll,
    toUpdate,
    toDelete,
    active,
    inActive,
    myInternships
}