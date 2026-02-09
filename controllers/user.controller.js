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

module.exports = { registerUser };