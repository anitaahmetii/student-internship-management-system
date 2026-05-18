const express = require('express');
const route = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');
const applicationController = require('../controllers/application.controller');

route.get('/dashboard', verifyToken, authorizeRole('hr'), applicationController.getAllApplicantsAsHr);

module.exports = route;