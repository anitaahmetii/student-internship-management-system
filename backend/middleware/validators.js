const { body, param, validationResult } = require('express-validator');

const extractError = (req, res, next) => 
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}
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
        .isBoolean()
        .withMessage('Visibility must be boolean!'),
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
const validateToUpdateUser = 
[
    body('name')
        .optional()                         
        .isString().withMessage('Name must be string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Name cannot be empty if provided!'),
    body('surname')
        .optional()                         
        .isString().withMessage('Surname must be string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Surname cannot be empty if provided!'),
    body('email')
        .optional()
        .isEmail().withMessage('Email must be valid!')
        .normalizeEmail(),
    body('birthDate')
        .optional()                         
        .isDate().withMessage('Birthdate must be date!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Birthdate cannot be empty if provided!'),
    body('phoneNumber')
        .optional()                         
        .isString().withMessage('Phone number must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Phone number cannot be empty if provided!'),
    body('city')
        .optional()                         
        .isString().withMessage('City must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('City cannot be empty if provided!'),
    body('password')
        .optional()                         
        .isString().withMessage('Password must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Password cannot be empty if provided!'),
    body('isVisible')
        .optional()
        .isBoolean()
        .withMessage('Visibility must be boolean!'),
    body('role')
        .optional()                         
        .isString().withMessage('Role must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Role cannot be empty if provided!'),
    extractError
];
const validateToUploadInternship = 
[
    body('position')
        .exists().withMessage('Position must be provided!')
        .bail()
        .isString().withMessage('Position must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Position cannot be empty!'),
    body('companyName')
        .exists().withMessage('Company name must be provided!')    
        .bail()                    
        .isString().withMessage('Company name must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Company name cannot be empty!'),
    body('responsibilities')
        .exists().withMessage('Responsibilities must be provided!')
        .bail()
        .isArray({ min: 1 }).withMessage('Responsibilities must be a non-empty array')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.trim() !== ''))
        .withMessage('Each responsibility must be a non-empty string'),
    body('preRequirements')
        .exists().withMessage('Prerequirements must be provided!')
        .bail()
        .isArray({ min: 1 }).withMessage('Prerequirements must be a non-empty array')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.trim() !== ''))
        .withMessage('Each prerequirement must be a non-empty string'),
    body('applicationDeadline')
        .exists().withMessage('Application deadline must be provided!')    
        .bail()                    
        .isDate().withMessage('Application deadline must be a date!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Application deadline cannot be empty!'),
    body('location')
        .exists().withMessage('City must be provided!')    
        .bail()                    
        .isString().withMessage('City must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('City cannot be empty!'),
    body('isVisible')
        .optional()
        .isBoolean().withMessage('Visibility must be boolean!'),
    extractError
];
const validateToUpdateInternship =
[
    body('position')
        .optional()
        .isString().withMessage('Position must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Position cannot be empty if provided!'),
    body('companyName')
        .optional()
        .isString().withMessage('Company name must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Company name cannot be empty if provided!'),
    body('responsibilities')
        .optional()
        .isArray({ min: 1 }).withMessage('Responsibilities must be a non-empty array if provided')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.trim() !== ''))
        .withMessage('Each responsibility must be a non-empty string if provided'),
    body('preRequirements')
        .optional()
        .isArray({ min: 1 }).withMessage('Prerequirements must be a non-empty array if provided')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.trim() !== ''))
        .withMessage('Each prerequirement must be a non-empty string if provided'),
    body('applicationDeadline')
        .optional()
        .isDate().withMessage('Application deadline must be a valid date!')
        .bail()
        .trim()
        .notEmpty().withMessage('Application deadline cannot be empty if provided!'),
    body('location')
        .optional()
        .isString().withMessage('City must be a string if provided!')
        .bail()
        .trim()
        .notEmpty().withMessage('City cannot be empty if provided!'),
    body('isVisible')
        .optional()
        .isBoolean().withMessage('Visibility must be boolean!'),
    extractError
];
const validateToUpdateApplication = 
[
    body('status')
        .optional()                         
        .isIn(['pending', 'accepted', 'rejected'])
        .withMessage("Status must be one of these values: 'pending', 'accepted', 'rejected'")
        .bail()
        .trim()                               
        .notEmpty().withMessage('Status cannot be empty if provided!'),
    body('feedback')
        .optional()                         
        .isString().withMessage('Feedback must be a string!') 
        .bail()
        .trim()                               
        .notEmpty().withMessage('Feedback cannot be empty if provided!'),
    body('isVisible')
        .optional()
        .isBoolean()
        .withMessage('Visibility must be boolean!'),
    extractError
];
const validateToSearchByStatus = 
[
    param('status')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("Status is required!")
        .isIn(['pending', 'accepted', 'rejected'])
        .withMessage("Status must be one of these values: 'pending', 'accepted', 'rejected'"),
    extractError
];
const validateToEnrollment = 
[
    body('mentorEmail')
        .exists().withMessage('Mentor email must be provided!')
        .bail()
        .isEmail().withMessage('Mentor email must be a valid email!')
        .bail()
        .trim()
        .notEmpty().withMessage('Mentor email cannot be empty!'),
    body('studentEmails')
        .exists().withMessage('Student emails must be provided!')
        .bail()
        .isArray({ min: 1 }).withMessage('Student emails must be a non-empty array!'),
    body('studentEmails.*')
        .isEmail().withMessage('Each student email must be valid!'),
    extractError
];
const validateToAddTask =
[
    param('internshipId')
        .exists().withMessage('Internship id must be provided!')
        .bail()
        .isMongoId().withMessage('Internship id must be valid!'),
    body('title')
        .exists().withMessage('Title must be provided!')
        .bail()
        .isString().withMessage('Title must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Title cannot be empty!')
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters!'),
    body('description')
        .exists().withMessage('Description is required!')
        .bail()
        .isString().withMessage('Description must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Description cannot be empty!')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters!'),
    body('requirements')
        .exists().withMessage('Requirements must be provided!')
        .bail()
        .isArray({ min: 1 })
        .withMessage('Requirements must be a non-empty array!'),
    body('requirements.*')
        .isString().withMessage('Each requirement must be a string!')
        .bail()
        .trim()
        .notEmpty().withMessage('Requirement cannot be empty!'),
    body('maxPoints')
        .exists().withMessage('Max points must be provided!')
        .bail()
        .isInt({ min: 0 })
        .withMessage('Max points must be a positive integer or zero!'),
    extractError
];
const validateAssign = 
[
  param('taskId')
    .exists().withMessage('Please provide taskId in params!')
    .bail()
    .isMongoId().withMessage('taskId must be a valid Mongo ID!'),
  extractError
];
const validateUniqueAssign =
[
    param('taskId')
        .exists().withMessage('Task ID must be provided!')
        .bail()
        .isMongoId().withMessage('Task ID must be valid!'),
    body('studentEmails')
        .exists().withMessage('studentEmails must be provided!')
        .bail()
        .isArray({ min: 1 })
        .withMessage('studentEmails must be a non-empty array!'),
    body('studentEmails.*')
        .isEmail()
        .withMessage('Each student email must be valid!')
        .bail(),
    extractError
];
module.exports = 
{ 
    validateState, 
    validateToUpdateState, 
    validateCity,
    validateToUpdateCity,
    validateToRegisterUser,
    validateToLoginUser,
    validateToUpdateUser,
    validateToUploadInternship,
    validateToUpdateInternship,
    validateToUpdateApplication,
    validateToSearchByStatus,
    validateToEnrollment,
    validateToAddTask,
    validateAssign,
    validateUniqueAssign
};