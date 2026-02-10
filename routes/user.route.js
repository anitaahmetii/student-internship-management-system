const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');
const auth = require('../middleware/auth');

route.post('/register', validator.validateToRegisterUser, userController.registerUser);
route.post('/login', validator.validateToLoginUser, userController.loginUser);
route.get('/', auth.verifyToken(['admin']), userController.getUsers);
route.post('/refresh', auth.verifyToken(['admin']), userController.refreshToken);
route.get('/current', userController.getCurrentUser);
route.delete('/delete/:id', auth.verifyToken(['admin']), userController.deleteUser);
route.put('/update/:email', auth.verifyToken(['admin']), validator.validateToUpdateUser, userController.updateUser);

module.exports = route;