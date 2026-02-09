const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');


route.post('/register', validator.validateUser, userController.registerUser);

module.exports = route;