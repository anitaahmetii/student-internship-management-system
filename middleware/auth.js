require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyHeader = (header) =>
{
    const token = header && header.split(' ')[1];
    return token;
}

const verifyToken = (allowedRoles = []) => 
{
    return (req, res, next) => 
    {

        const token = verifyHeader(req.headers.authorization);
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
module.exports = { verifyToken, verifyHeader };