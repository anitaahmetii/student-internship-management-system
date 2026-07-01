const Company = require('../models/Company');
const cityService = require('./city.service');

const create = async (userId, name, description, industry, email, phoneNumber, address, city, website, logoUrl, isActive) =>
{
    try
    {
        const { exists: cityExists, cityId } = await cityService.findCity(city);
        if (!cityExists) return "City not found!";

        const phoneNumberExists = await checkPhoneNumber(phoneNumber);
        if (phoneNumberExists) return "Phone number already exists!";

        const emailExists = await checkEmail(email);
        if (emailExists) return "Email already exists!";

        const company = new Company({ name, description, industry, email, phoneNumber, address, city: cityId, website, 
                                    logoUrl, isActive, createdBy: userId });

        return await company.save();
    }
    catch(err)
    {
        throw new Error(`Database error while creating company: ${err.message}`);
    }
}

const getAll = async () => 
{
    try 
    {
        const companies = await Company.find({})
                                      .populate({ path: 'city', select: 'name -_id' })
                                      .populate({ path: 'createdBy', select: 'email -_id' })
                                      .lean();
        return companies;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving companies: ${err.message}`);
    }
}

const getById = async (companyId) => 
{
    try
    {
        const company = await Company.findById(companyId);
        
        if (!company) return "Company not found!";
        
        return company;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving company by id: ${err.message}`);
    }
}

const update = async (companyId, userId, name, description, industry, email, phoneNumber, 
                      address, city, website, logoUrl, isActive) =>
{
    try 
    {
        const company = await getById(companyId);
        
        if (company.createdBy.toString() !== userId.toString()) throw new Error("You do not have permission to update this company!"); 
        
        let cityAvailable, locationId; 
        if (city) 
        { 
            ({ exists: cityAvailable, cityId: locationId } = await cityService.findCity(city));
            if (!cityAvailable) throw new Error("City not found!"); 
        }
        if (phoneNumber) 
        { 
            const phoneNumberExists = await checkPhoneNumber(phoneNumber); 
            if (phoneNumberExists) return "Phone number already exists!"; 
        } 
        if (email) 
        { 
            const emailExists = await checkEmail(email); 
            if (emailExists) return "Email already exists!"; 
        }

        const updatedCompany = await Company.findByIdAndUpdate({ _id: companyId },
                                                                { 
                                                                    name, 
                                                                    description, 
                                                                    industry, 
                                                                    email, 
                                                                    phoneNumber, 
                                                                    address, 
                                                                    city: locationId, 
                                                                    website, 
                                                                    logoUrl, 
                                                                    isActive 
                                                                }, { new: true, runValidators: true });

        return updatedCompany;
    }
    catch(err)
    {
        throw new Error(`Database error while updating company: ${err.message}`);
    }
}

const deleteCompany = async (companyId, userId) => 
{
    try 
    {
        const company = await getById(companyId);

        if (company.createdBy.toString() !== userId.toString()) throw new Error("You do not have permission to delete this company!"); 

        const deletedCompany = await Company.findByIdAndDelete({ _id: companyId });
        return deletedCompany;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting company: ${err.message}`);
    }
}

const getByName = async (companyName) => 
{
    try
    {
        const company = await Company.findOne({ name: { $regex: companyName, $options: 'i' } })
                                    .populate({ path: 'city', select: 'name -_id' })
                                    .populate({ path: 'createdBy', select: 'email -_id' })
                                    .lean();
        
        if (!company) return "No company found with this name!";
        
        return company;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving company by name: ${err.message}`);
    }
}

const getByIndustry = async (industry) => 
{
    try
    {
        const companies = await Company.find({ industry: { $regex: industry, $options: 'i' } })
                                      .populate({ path: 'city', select: 'name -_id' })
                                      .populate({ path: 'createdBy', select: 'email -_id' })
                                      .lean();
        
        if (companies.length === 0) return "No companies found in this industry!";
        
        return companies;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving companies by industry: ${err.message}`);
    }
}

const getByCity = async (cityName) => 
{
    try
    {
        const { exists: cityExists, cityId } = await cityService.findCity(cityName);
        if (!cityExists) throw new Error("City not found!");

        const companies = await Company.find({ city: cityId })
                                      .populate({ path: 'city', select: 'name -_id' })
                                      .populate({ path: 'createdBy', select: 'email -_id' })
                                      .lean();
        
        if (companies.length === 0) return "No companies found in this city!";
        
        return companies;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving companies by city: ${err.message}`);
    }
}

const getActive = async () => 
{
    try
    {
        const activeCompanies = await Company.find({ isActive: true })
                                            .populate({ path: 'city', select: 'name -_id' })
                                            .populate({ path: 'createdBy', select: 'email -_id' })
                                            .lean();
        
        if (activeCompanies.length === 0) return "No active companies found!";
        
        return activeCompanies;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving active companies: ${err.message}`);
    }
}

const getByCreator = async (userId) => 
{
    try
    {
        const companies = await Company.find({ createdBy: userId })
                                      .populate({ path: 'city', select: 'name -_id' })
                                      .populate({ path: 'createdBy', select: 'email -_id' })
                                      .lean();
        
        if (companies.length === 0) return "You haven't created any companies!";
        
        return companies;
    }
    catch(err)
    {
        throw new Error(`Database error while retrieving your companies: ${err.message}`);
    }
}
const checkPhoneNumber = async (phoneNumber) =>
{
    const exists = await Company.findOne({ phoneNumber: phoneNumber });
    return !!exists;
}
const checkEmail = async (email) =>
{
    const exists = await Company.findOne({ email: email });
    return !!exists;
}
const checkCompany = async (companyId) => 
{
    const exists = await Company.findById(companyId);
    return !!exists;
}
module.exports = 
{
    create,
    getAll,
    getById,
    update,
    deleteCompany,
    getByName,
    getByIndustry,
    getByCity,
    getActive,
    getByCreator,
    checkCompany
}