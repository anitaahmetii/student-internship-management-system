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
const validateToRegisterUser = 
[
    body('name')
        .exists().withMessage('Name must be provided!')
        .bail()
        .isString().withMessage('Name must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Name cannot be empty!'),
    body('surname')
        .exists().withMessage('Surname must be provided!')    
        .bail()                    
        .isString().withMessage('Surname must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Surname cannot be empty!'),
    body('email')
        .exists().withMessage('Email must be provided!')
        .bail()
        .isString().withMessage('Email must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Email cannot be empty!'),
    body('birthDate')
        .exists().withMessage('Birthdate must be provided!')    
        .bail()                    
        .isDate().withMessage('Birthdate must be a date!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Birthdate cannot be empty!'),
    body('phoneNumber')
        .optional()                         
        .isString().withMessage('Phone number must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Phone number cannot be empty if provided!'),
    body('city')
        .exists().withMessage('City must be provided!')    
        .bail()                    
        .isString().withMessage('City must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('City cannot be empty!'),
    body('password')
        .exists().withMessage('Password must be provided!')    
        .bail()                    
        .isString().withMessage('Password must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Password cannot be empty!'),
    body('isVisible')
        .optional()                         
        .isBoolean().withMessage('Visibility must be boolean!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Visibility cannot be empty if provided!'),
    body('role')
        .exists().withMessage('Role must be provided!')    
        .bail()                    
        .isString().withMessage('Role must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Role cannot be empty!'),
    extractError
];
const validateToLoginUser =
[
    body('email')
        .exists().withMessage('Email must be provided!')
        .bail()
        .isString().withMessage('Email must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Email cannot be empty!'),
    body('password')
        .exists().withMessage('Password must be provided!')    
        .bail()                    
        .isString().withMessage('Password must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Password cannot be empty!'),
    extractError
];

module.exports = 
{ 
    validateRole, 
    validateToUpdateRole,
    validateState, 
    validateToUpdateState, 
    validateCity,
    validateToUpdateCity,
    validateToRegisterUser,
    validateToLoginUser
};