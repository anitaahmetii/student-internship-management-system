const companyService = require('../services/company.service');

const createCompany = async (req, res) => 
{
    try 
    {
        const { name, description, industry, email, phoneNumber, address, city, website, logoUrl, isActive } = req.body;
        const userId = req.user._id;

        const company = await companyService.create( userId, name, description, industry, email, phoneNumber, address, city, website, logoUrl, isActive);

        if (typeof company === 'string')
        {
            return res.status(400).json({ message: company });
        }

        return res.status(201).json({ message: "Company created successfully!", company });
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getAllCompanies = async (req, res) => 
{
    try 
    {
        const companies = await companyService.getAll();
        
        if (companies.length === 0) 
        {
            return res.status(404).json({ message: "No companies found!" });
        }

        return res.status(200).json(companies);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getCompanyById = async (req, res) => 
{
    try 
    {
        const { id } = req.params;
        const company = await companyService.getById(id);

        if (typeof company === 'string')
        {
            return res.status(404).json({ message: company });
        }

        return res.status(200).json(company);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const updateCompany = async (req, res) => 
{
    try 
    {
        const { id } = req.params;
        const { name, description, industry, email, phoneNumber, address, city, website, logoUrl, isActive } = req.body;
        const userId = req.user._id;

        const updatedCompany = await companyService.update(id, userId, name, description, industry, email, phoneNumber, address, city, website, logoUrl, isActive);

        if (typeof updatedCompany === 'string')
        {
            return res.status(400).json({ message: updatedCompany });
        }

        return res.status(200).json({ message: "Company updated successfully!", company: updatedCompany });
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const deleteCompany = async (req, res) => 
{
    try 
    {
        const { id } = req.params;
        const userId = req.user._id;

        const deletedCompany = await companyService.deleteCompany(id, userId);

        return res.status(200).json({ message: "Company deleted successfully!", company: deletedCompany });
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getCompanyByName = async (req, res) => 
{
    try 
    {
        const { name } = req.params;
        const company = await companyService.getByName(name);

        if (typeof company === 'string')
        {
            return res.status(404).json({ message: company });
        }

        return res.status(200).json(company);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getCompaniesByIndustry = async (req, res) => 
{
    try 
    {
        const { industry } = req.params;
        const companies = await companyService.getByIndustry(industry);

        if (typeof companies === 'string')
        {
            return res.status(404).json({ message: companies });
        }

        return res.status(200).json(companies);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getCompaniesByCity = async (req, res) => 
{
    try 
    {
        const { city } = req.params;
        const companies = await companyService.getByCity(city);

        if (typeof companies === 'string')
        {
            return res.status(404).json({ message: companies });
        }

        return res.status(200).json(companies);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getActiveCompanies = async (req, res) => 
{
    try 
    {
        const companies = await companyService.getActive();

        if (typeof companies === 'string')
        {
            return res.status(404).json({ message: companies });
        }

        return res.status(200).json(companies);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

const getMyCompanies = async (req, res) => 
{
    try 
    {
        const userId = req.user._id;
        const companies = await companyService.getByCreator(userId);

        if (typeof companies === 'string')
        {
            return res.status(404).json({ message: companies });
        }

        return res.status(200).json(companies);
    }
    catch(err)
    {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = 
{
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyByName,
    getCompaniesByIndustry,
    getCompaniesByCity,
    getActiveCompanies,
    getMyCompanies
}