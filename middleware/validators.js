const { body, validationResult } = require('express-validator');

const extractError = (req, res, next) => 
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}

const validateRole = 
[
    body('role')
        .exists().withMessage('Role must be provided!')
        .bail()
        .isString().withMessage('Role must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Role cannot be empty!'),
    body('permission')
        .optional()                          // 1️⃣ kontrollo opsionalitetin së pari
        .isString().withMessage('Permission must be a string!')  // 2️⃣ vetëm nëse ekziston
        .bail()
        .trim()                               
        .notEmpty().withMessage('Permission cannot be empty if provided!'),
    extractError
];

module.exports = { validateRole };