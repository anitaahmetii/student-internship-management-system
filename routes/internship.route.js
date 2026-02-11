const express = require('express');
const route = express.Router();
const internshipController = require('../controllers/internship.controller');
const auth = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/upload', auth.verifyToken(['admin', 'hr']), validator.validateToUploadInternship, internshipController.uploadInternship);
route.get('/', internshipController.getInternships);
route.put('/update/:internship', auth.verifyToken(['admin', 'hr']), validator.validateToUpdateInternship, internshipController.updateInternship);
route.delete('/delete/:internship', auth.verifyToken(['admin', 'hr']), internshipController.deleteInternship);
route.get('/activeInternships', internshipController.getActiveInternships);
route.get('/inActiveInternships', auth.verifyToken(['admin', 'hr']), internshipController.getInActiveInternships);
route.get('/hrInternships', auth.verifyToken(['admin', 'hr']), internshipController.getHRInternships);
route.get('/byCity/:city', internshipController.getInternshipsByCity);
route.get('/byPosition/:position', internshipController.getInternshipByPosition);

module.exports = route;