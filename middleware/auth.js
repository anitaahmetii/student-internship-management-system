require('dotenv').config();
const jwt = require('jsonwebtoken');

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