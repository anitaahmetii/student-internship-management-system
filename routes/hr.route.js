const express = require('express');
const route = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');
const applicationController = require('../controllers/application.controller');

route.get('/dashboard', verifyToken, authorizeRole('hr'), 
            (req, res, next) => {  res.set('Cache-Control', 'no-store'); next(); },
            applicationController.getAllApplicantsAsHr);

module.exports = route;