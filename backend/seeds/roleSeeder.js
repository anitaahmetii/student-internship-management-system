const Role = require('../models/Role');

const roles = ['admin', 'hr', 'mentor', 'student'];

const seedRoles = async () => {
    try 
    {
        for (const roleName of roles) 
        {
            const exists = await Role.findOne({ role: roleName });
            if (!exists) { await Role.create({ role: roleName }); } 
        }
    } 
    catch (err) 
    {
        throw new Error(`Error seeding roles: ${err.message}`);
    }
};

module.exports = { seedRoles };