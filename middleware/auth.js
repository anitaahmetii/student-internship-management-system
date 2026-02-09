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
        role: user.role.role
    }
    //{ expiresIn: '15s' }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    // const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decode);
    return token;
}
const verifyToken = (allowedRoles = []) => 
{
    return (req, res, next) => 
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'Access denied' });

        try
        {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;

            if (allowedRoles.length && !allowedRoles.includes(req.user.role))
            {
                return res.status(403).json({ error: 'Insufficient permissions' })
            }
            next();
        }
        catch (err) 
        {
            return res.status(403).json({ error: 'Invalid token' });
        }   
    }
}
module.exports = { generateToken, verifyToken };