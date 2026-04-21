require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (allowedRoles = []) => 
{
    return async (req, res, next) => 
    {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'Access denied' });

        try
        {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded._id);
            if (!user) return res.status(401).json({ error: 'User not found' });

            if (allowedRoles.length && !allowedRoles.includes(user.role.role))
            {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next();
        }
        catch (err) 
        {
            return res.status(403).json({ error: 'Invalid token' });
        }   
    }
}
module.exports = { verifyToken };