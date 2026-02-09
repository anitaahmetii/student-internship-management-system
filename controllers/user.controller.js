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
        const loginUser = await userService.login(email, password);
        return res.status(200).json(loginUser);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
module.exports = { registerUser, loginUser };