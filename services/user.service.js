require('dotenv').config();
const User = require('../models/User');
const roleService = require('./role.service');
const cityService = require('./city.service');
const bcrypt = require('bcrypt');
const token = require('../middleware/auth');

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
        throw new Error(`Database error while registering user: ${err.message}`);
    }
}
const login = async (email, password) =>
{
    try
    {
        const user = await checkUser(email);
        if (!user) throw new Error("User does not exist!");

        const verifyPassword = await checkPassword(password, user.password);
        if (!verifyPassword) throw new Error("Password does not match");
        
        const userLoggedIn = await token.generateToken(user);
        return { userLoggedIn, 
                user: 
                {
                    id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    role: user.role
                }
            };
    }
    catch(err)
    {
        throw new Error(`Database error while logging user: ${err.message}`);
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
const checkPassword = async (loginPassword, hashedPassword) => 
{
    const exists = await bcrypt.compare(loginPassword, hashedPassword);
    return !!exists;
}
const checkUser = async (email) =>
{
    const user = await User.findOne({ email: email });
    return user;
}
module.exports = { register, login };