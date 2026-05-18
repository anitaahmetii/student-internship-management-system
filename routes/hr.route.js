const express = require('express');
const route = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.get('/dashboard', verifyToken, authorizeRole('hr'), (req, res) => { res.render('hrDashboard'); });

module.exports = route;