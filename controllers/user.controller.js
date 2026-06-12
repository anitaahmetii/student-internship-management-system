const userService = require('../services/user.service');
const { authResponder } = require('../middleware/authResponder');

const registerUser = async (req, res) => 
{
    try 
    {
        const { name, surname, email, birthDate, phoneNumber, city, password } = req.body;
        const addUser = await userService.register(name, surname, email, birthDate, phoneNumber, city, password); 
        return res.status(201).json(addUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const registerUserAsHR = async (req, res) => 
{
    try 
    {
        const { name, surname, email, birthDate, phoneNumber, city, password } = req.body;
        const addUser = await userService.registerHR(name, surname, email, birthDate, phoneNumber, city, password); 
        return res.status(201).json(addUser);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}
const registerUserAsMentor = async (req, res) => 
{
    try 
    {
        const { name, surname, email, birthDate, phoneNumber, city, password } = req.body;
        const addUser = await userService.registerMentor(name, surname, email, birthDate, phoneNumber, city, password); 
        return res.status(201).json(addUser);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}
const loginUser = async (req, res) => 
{
    try
    {
        const { email, password } = req.body;
        const tokens = await userService.login(email, password);

        return authResponder(req, res, tokens); 
    }
    catch(err)
    {
        res.status(401).json(err.message);
    }
}
const logoutUser = async (req, res) => 
{
    try
    {
        await userService.logout(req.user._id);
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch(err)
    {
        return res.status(500).json({ error: err.message });
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
        const tokens = await userService.refresh(refreshToken);
        res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }
    catch(err)
    {
        res.status(401).json(err.message);
        console.log(err.message);
    }
}
const getCurrentUser = async (req, res) =>
{
    try
    {
        const currentUser = await userService.current(req.user._id);
        res.json(currentUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const deleteUser = async (req, res) =>
{
    try 
    {
        const { id } = req.params;
        const deletedUser = await userService.toDelete(id);
        res.json({ message: 'Successfully deleted', user: deletedUser });
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const updateUser = async (req, res) =>
{
    try 
    {
        const { email: emailParam } = req.params;
        const { name, surname, email, birthDate, phoneNumber, city, password, role } = req.body;
        
        const updatedUser = await userService.toUpdate(emailParam, name, surname, email, birthDate, phoneNumber, city, password, role);
        return res.status(200).json(updatedUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
module.exports = 
{ 
    registerUser,
    registerUserAsHR, 
    registerUserAsMentor,
    loginUser, 
    getUsers, 
    refreshToken, 
    getCurrentUser,
    deleteUser,
    updateUser,
    logoutUser
};