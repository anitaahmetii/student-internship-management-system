const express = require('express');
const route = express.Router();
const validator = require('../middleware/validators');
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/enrollment', verifyToken, authorizeRole('admin', 'hr'), validator.validateToEnrollment, enrollmentController.registerEnrollment);
route.get('/:position', verifyToken, authorizeRole('mentor'), enrollmentController.getEnrollments);

module.exports = route;