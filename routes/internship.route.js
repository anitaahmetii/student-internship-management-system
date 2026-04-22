const express = require('express');
const route = express.Router();
const internshipController = require('../controllers/internship.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/upload', verifyToken, authorizeRole('admin', 'hr'), validator.validateToUploadInternship, internshipController.uploadInternship);
route.get('/', internshipController.getInternships);
route.put('/update/:internship', verifyToken, authorizeRole('admin', 'hr'), validator.validateToUpdateInternship, internshipController.updateInternship);
route.delete('/delete/:internship', verifyToken, authorizeRole('admin', 'hr'), internshipController.deleteInternship);
route.get('/activeInternships', internshipController.getActiveInternships);
route.get('/inActiveInternships', verifyToken, authorizeRole('admin', 'hr'), internshipController.getInActiveInternships);
route.get('/hrInternships', verifyToken, authorizeRole('admin', 'hr'), internshipController.getHRInternships);
route.get('/byCity/:city', verifyToken, internshipController.getInternshipsByCity);
route.get('/byPosition/:position', verifyToken, internshipController.getInternshipByPosition);

module.exports = route;