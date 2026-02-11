const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const applicationController = require('../controllers/application.controller');
const validate = require('../middleware/validators');

route.post('/register/:internship', auth.verifyToken(['student']), applicationController.uploadApplication);
route.get('/', auth.verifyToken(['admin']), applicationController.getAllApplications);
route.put('/update/:application', auth.verifyToken(['admin', 'hr']), validate.validateToUpdateApplication, applicationController.updateApplication);
route.delete('/delete/:application', auth.verifyToken(['admin', 'hr']), applicationController.deleteApplication);
route.get('/studentApplications', auth.verifyToken(['student']), applicationController.getStudentApplications);
route.get('/hrApplications', auth.verifyToken(['hr']), applicationController.getHrApplications);

module.exports = route;