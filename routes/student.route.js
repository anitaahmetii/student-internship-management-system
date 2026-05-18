const express = require('express');
const route = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.get('/dashboard', verifyToken, authorizeRole('student'), (req, res) => { res.render('studentDashboard'); });

module.exports = route;