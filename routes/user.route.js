const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');


route.post('/register', validator.validateToRegisterUser, userController.registerUser);
route.post('/login', validator.validateToLoginUser, userController.loginUser);

module.exports = route;