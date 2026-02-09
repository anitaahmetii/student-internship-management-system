require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = async (user) => 
{
    const payload = 
    {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return token;
}

module.exports = { generateToken };