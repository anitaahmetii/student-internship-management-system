const express = require('express');
const route = express.Router();
const applicationController = require('../controllers/application.controller');
const validate = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/register/:internship', verifyToken, authorizeRole('student'), applicationController.uploadApplication);
route.get('/', verifyToken, authorizeRole(['admin']), applicationController.getAllApplications);
route.put('/update/:application', verifyToken, authorizeRole('admin', 'hr'), validate.validateToUpdateApplication, applicationController.updateApplication);
route.delete('/delete/:application', verifyToken, authorizeRole('admin', 'hr'), applicationController.deleteApplication);
route.get('/studentApplications', verifyToken, authorizeRole('student'), applicationController.getStudentApplications);
route.get('/hrApplications', verifyToken, authorizeRole('hr'), applicationController.getHrApplications);
route.get('/status/:status', verifyToken, authorizeRole('admin', 'hr'), validate.validateToSearchByStatus, applicationController.getApplicationsByStatus);
route.get('/acceptedStudents', verifyToken, authorizeRole('admin', 'hr'), applicationController.getAcceptedStudents);

module.exports = route;