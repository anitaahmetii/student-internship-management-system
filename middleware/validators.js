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
        .optional()                         
        .isString().withMessage('Permission must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Permission cannot be empty if provided!'),
    extractError
];
const validateToUpdateRole = 
[
    body('role')
        .optional()                         
        .isString().withMessage('Role must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Role cannot be empty if provided!'),
    body('permission')
        .optional()                         
        .isString().withMessage('Permission must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Permission cannot be empty if provided!'),
    extractError
];
const validateState = 
[
    body('name')
        .exists().withMessage('Name must be provided!')
        .bail()
        .isString().withMessage('Name must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Name cannot be empty!'),
    body('code')
        .exists().withMessage('Code must be provided!')    
        .bail()                    
        .isString().withMessage('Code must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Code cannot be empty!'),
    extractError
];
const validateToUpdateState = 
[
    body('name')
        .optional()                         
        .isString().withMessage('Name must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Name cannot be empty if provided!'),
    body('code')
        .optional()                         
        .isString().withMessage('Name must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Name cannot be empty if provided!'),
    extractError
];
const validateCity = 
[
    body('name')
        .exists().withMessage('Name must be provided!')
        .bail()
        .isString().withMessage('Name must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Name cannot be empty!'),
    body('state')
        .exists().withMessage('State must be provided!')    
        .bail()                    
        .isString().withMessage('State must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('State cannot be empty!'),
    extractError
];
const validateToUpdateCity =
[
    body('name')
        .optional()                         
        .isString().withMessage('Name must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Name cannot be empty if provided!'),
    body('state')
        .optional()                         
        .isString().withMessage('State must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('State cannot be empty if provided!'),
    extractError
];

module.exports = 
{ 
    validateRole, 
    validateToUpdateRole,
    validateState, 
    validateToUpdateState, 
    validateCity,
    validateToUpdateCity 
};