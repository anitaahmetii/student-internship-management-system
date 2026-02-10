require('dotenv').config();
const User = require('../models/User');
const roleService = require('./role.service');
const cityService = require('./city.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (name, surname, email, birthDate, phoneNumber, city, password, role) => 
{
    try
    {
        const { exists: cityAvailable, cityId: idCity } = await cityService.findCity(city);
        if (!cityAvailable) throw new Error("City not available!");

        const { exists: roleAvailable, id: roleId } = await roleService.roleExists(role);
        if (!roleAvailable) throw new Error('Role not available!');
        //me kontrollu nese eshte roli admin mos me leju me insertu sepse nuk ka permission

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
const generateTokens = async (user) => 
{
    const payload = 
    {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role.role
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d'});
    // const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decode);
    return { accessToken, refreshToken };
}
const login = async (email, password) =>
{
    try
    {
        const user = await checkUser(email);
        if (!user) throw new Error("User does not exist!");

        const verifyPassword = await checkPassword(password, user.password);
        if (!verifyPassword) throw new Error("Password does not match");
        
        const { accessToken: userAccessToken, refreshToken: userRefreshToken } = await generateTokens(user);
        
        return { userAccessToken, userRefreshToken };
    }
    catch(err)
    {
        throw new Error(`Database error while logging user: ${err.message}`);
    }
}
const refresh = async (refreshToken) => 
{
    try
    {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await getUserByIdAndRole(payload._id);
        if (!user) throw new Error('User not found');
        return generateTokens(user);
    }
    catch (err) {
        throw new Error(`Invalid refresh token: ${err.message}`);
    }
}
const getAll = async () => 
{
    try 
    {
        const users = await User.find({})
                                .populate({ path: 'city', select: 'name -_id'})
                                .populate({ path: 'role', select: 'role -_id'}).lean();
        return users.map(u => ({ _id: u._id,
                                name: u.name,
                                surname: u.surname,
                                email: u.email,
                                birthDate: u.birthDate,
                                phoneNumber: u.phoneNumber,
                                city: u.city,
                                visibility: u.isVisible,
                                role: u.role
        }));
    }
    catch(err)
    {
        throw new Error(`Database error while retriving users: ${err.message}`);
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
    const user = await User.findOne({ email: email })
                            .populate({ path: 'city', select: 'name -_id'})
                            .populate({ path: 'role', select: 'role -_id'}).lean();
    return user;
}
const getUserByIdAndRole = async (id) =>
{
    const user = await User.findById({ _id: id })
                           .select('-password')
                           .populate({ path: 'role', select: 'role -_id'}).lean();
    return user;
}
const current = async (token) =>
{
    try 
    {
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = verifyToken._id;
        const currentUser = await User.findById({ _id: userId }).select('-password');
        return currentUser;
    }
    catch(err)
    {
        throw new Error(`Failed to get current user: ${err.message}`);
    }
}
const toDelete = async (id) => 
{
    try
    {
        const deleteUser = await User.findByIdAndDelete({ _id: id });
        return deleteUser;
    }
    catch(err)
    {
        throw new Error(`Failed to delete user: ${err.message}`);
    }  
}
const findById = async (id) => 
{c
    const exists = await User.findOne({ _id: id });
    return !!exists;
}
const toUpdate = async (emailParam, name, surname, email, birthDate, phoneNumber, city, password, role) => 
{
    try
    {
        const userExists = await checkEmail(emailParam);
        if (!userExists) throw new Error("User does not exist!");

        let cityAvailable, cityID;
        if (city)
        {
            ({ exists: cityAvailable, cityId: cityID } = await cityService.findCity(city));
            if (!cityAvailable) throw new Error("City not available!");
        }

        let roleAvailable, roleID;
        if (role)
        {
            ({ exists: roleAvailable, id: roleID } = await roleService.roleExists(role));
            if (!roleAvailable) throw new Error('Role not available!');
        }
        
        if (email)
        {
            const emailExists = await checkEmail(email);
            if (emailExists) throw new Error("Email already exists!");
        }

        if (phoneNumber)
        {
            const phoneNumberExists = await checkPhoneNumber(phoneNumber);
            if (phoneNumberExists) throw new Error("Phone number already exists!");
        }
        
        let hashedPassword;
        if (password)
        {
            hashedPassword = await hashPassword(password);
        }

        const updatedUser = await User.findOneAndUpdate({ email: emailParam }, 
                                                          { name: name, 
                                                            surname: surname,
                                                            email: email, 
                                                            birthDate: birthDate,
                                                            phoneNumber: phoneNumber,
                                                            city: cityID,
                                                            password: hashedPassword, 
                                                            role: roleID },
                                                          { new: true, runValidators: true });
        return updatedUser;
    }
    catch(err)
    {
        throw new Error(`Failed to update user: ${err.message}`);
    }  
}
module.exports = 
{ 
    register, 
    login, 
    getAll, 
    refresh, 
    current,
    toDelete,
    toUpdate
};