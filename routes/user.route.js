const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/register', validator.validateToRegisterUser, userController.registerUser);
route.post('/login', validator.validateToLoginUser, userController.loginUser);
route.get('/', verifyToken, authorizeRole('admin'), userController.getUsers);
route.post('/refresh', verifyToken, userController.refreshToken);
route.get('/current', verifyToken, userController.getCurrentUser);
route.delete('/delete/:id', verifyToken, authorizeRole('admin'), userController.deleteUser);
route.put('/update/:email', verifyToken, authorizeRole('admin'), validator.validateToUpdateUser, userController.updateUser);

module.exports = route;