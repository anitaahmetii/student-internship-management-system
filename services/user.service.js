const User = require('../models/User');
const roleService = require('./role.service');
const cityService = require('./city.service');
const bcrypt = require('bcrypt');

const register = async (name, surname, email, birthDate, phoneNumber, city, password, role) => 
{
    try
    {
        const { exists: cityAvailable, cityId: idCity } = await cityService.findCity(city);
        if (!cityAvailable) throw new Error("City not available!");

        const { exists: roleAvailable, id: roleId } = await roleService.roleExists(role);
        if (!roleAvailable) throw new Error('Role not available!');

        const emailExists = await checkEmail(email);
        if (emailExists) throw new Error("Email already exists!");

        const phoneNumberExists = await checkPhoneNumber(phoneNumber);
        if (phoneNumberExists) throw new Error("Phone number already exists!");
        
        const hashedPassword = await hashPassword(password);
        const user = new User({ name, 
                                surname, 
                                email, 
                                birthDate, 
                                phoneNumber, 
                                city: idCity, 
                                password: hashedPassword, 
                                role: roleId });
        return await user.save();
    }
    catch(err)
    {
        throw new Error(`Database error while while registering user: ${err.message}`);
    }
}
const checkEmail = async (email) =>
{
    const exists = await User.findOne({ email: email });
    return !!exists;
}
const checkPhoneNumber = async (phoneNumber) =>
{
    const exists = await User.findOne({ phoneNumber: phoneNumber });
    return !!exists;
}
const hashPassword = async (password) =>
{
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}
module.exports = { register };