const express = require('express');
const route = express.Router();
const internshipController = require('../controllers/internship.controller');
const auth = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/upload', auth.verifyToken(['admin', 'hr']), validator.validateToUploadInternship, internshipController.uploadInternship);
route.get('/', internshipController.getInternships);
route.put('/update/:internship', auth.verifyToken(['admin', 'hr']), validator.validateToUpdateInternship, internshipController.updateInternship);
route.delete('/delete/:internship', auth.verifyToken(['admin', 'hr']), internshipController.deleteInternship);

module.exports = route;