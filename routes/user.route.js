const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');
const auth = require('../middleware/auth');

route.post('/register', validator.validateToRegisterUser, userController.registerUser);
route.post('/login', validator.validateToLoginUser, userController.loginUser);
route.get('/', auth.verifyToken(['admin']), userController.getUsers);

module.exports = route;