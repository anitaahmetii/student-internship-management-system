const express = require('express');
const route = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');
const applicationController = require('../controllers/application.controller');

route.get('/dashboard', verifyToken, authorizeRole('student'), 
 (req, res, next) => {  res.set('Cache-Control', 'no-store'); next(); },
applicationController.getStudentApplications);

module.exports = route;