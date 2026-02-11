const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const applicationController = require('../controllers/application.controller');

route.post('/register/:internship', auth.verifyToken(['student']), applicationController.uploadApplication);

module.exports = route;