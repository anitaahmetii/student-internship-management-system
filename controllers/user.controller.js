const userService = require('../services/user.service');

const registerUser = async (req, res) => 
{
    try 
    {
        const { name, surname, email, birthDate, phoneNumber, city, password, role } = req.body;
        const addUser = await userService.register(name, surname, email, birthDate, phoneNumber, city, password, role); 
        return res.status(201).json(addUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const loginUser = async (req, res) => 
{
    try
    {
        const { email, password } = req.body;
        const { userAccessToken, userRefreshToken } = await userService.login(email, password);
        // console.log(loginUser);
        return res.status(200).json({ accessToken: userAccessToken, refreshToken: userRefreshToken });
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getUsers = async (req, res) =>
{
    try
    {
        const users = await userService.getAll();
        return res.status(200).json(users);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const refreshToken = async (req, res) =>
{
    try 
    {
        const { refreshToken } = req.body;
        const refresh = await userService.refresh(refreshToken);
        res.json(refresh);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getCurrentUser = async (req, res) =>
{
    try
    {
        const header = req.headers.authorization;
        const token = header && header.split(' ')[1];
        const currentUser = await userService.current(token);
        res.json(currentUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
module.exports = { registerUser, loginUser, getUsers, refreshToken, getCurrentUser };