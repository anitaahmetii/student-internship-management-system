require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => 
{
    try
    {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1] || req.cookies?.accessToken; 

        if (!token) return res.status(401).json({ error: 'You need to logg in' });

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodeToken;

        next();
    }
    catch (err) 
    {
        return res.status(401).json({ error: 'Invalid token' });
    }   
}
const authorizeRole = (...roles) => 
{
    return (req, res, next) => 
    {
       if (!roles.includes(req.user.role))
        {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

module.exports = { verifyToken, authorizeRole }