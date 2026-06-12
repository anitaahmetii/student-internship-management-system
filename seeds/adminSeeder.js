require('dotenv').config();
const User = require('../models/User');
const roleService = require('../services/role.service');
const userService = require('../services/user.service');
const cityService = require('../services/city.service');

const seedAdmin = async () => {
    try 
    {
        const adminRole = await roleService.getAdminRole();

        const adminExists = await User.findOne({ role: adminRole._id });
        if (adminExists) { return; }

        const { exists: cityAvailable, cityId } = await cityService.findCity("Prishtina");
        if (!cityAvailable) throw new Error("City not available!");

        const hashedPassword = await userService.hashPassword(process.env.ADMIN_PASSWORD);

        await User.create({
            name: 'Alexander',
            surname: 'Johnson',
            email: process.env.ADMIN_EMAIL,
            birthDate: "1994-02-18",
            phoneNumber: "+38344100001",
            city: cityId,
            password: hashedPassword,
            role: adminRole._id,
        });
    } 
    catch (err) 
    {
        throw new Error(`Error seeding admin: ${err.message}`);
    }
};

module.exports = { seedAdmin };