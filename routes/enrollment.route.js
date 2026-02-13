const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const validator = require('../middleware/validators');
const enrollmentController = require('../controllers/enrollment.controller');

route.post('/enrollment', auth.verifyToken(['admin', 'hr']), validator.validateToEnrollment, enrollmentController.registerEnrollment);
route.get('/:position', auth.verifyToken(['mentor']), enrollmentController.getEnrollments);

module.exports = route;