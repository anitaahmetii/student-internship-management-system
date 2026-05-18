const jwt = require('jsonwebtoken');

const authResponder = (req, res, tokens) => 
{
    const isHtml = req.headers.accept?.includes('text/html');

    if (isHtml) 
    {
        res.cookie('accessToken', tokens.accessToken, { 
            httpOnly: true, 
            sameSite: 'strict'
        });
        res.cookie('refreshToken', tokens.refreshToken, { 
            httpOnly: true, 
            sameSite: 'strict'
        });
        const decoded = jwt.decode(tokens.accessToken);
        if (decoded.role === 'hr') return res.redirect('/hr/dashboard');
        if (decoded.role === 'student') return res.redirect('/student/dashboard');
        return res.redirect('/');
    }
    return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
}

module.exports = { authResponder }